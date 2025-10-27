import { query } from "../config/database";
import pool from "../config/database";
import { Question } from "../model/question.model";
import { Answer } from "../model/answer.model";
import { ExamQuestionService } from "./exam.question.service";
import { ExamQuestion } from "../model/exam.question.model";

const QuestionService = {
    async get(question_ids: number[]): Promise<Question[]> {
        if (!question_ids || question_ids.length === 0) {
            return [];
        }

        const queryText = 'SELECT * FROM question WHERE question_id = ANY($1)';
        const result = await query(queryText, [question_ids]);

        return result.rows;
    },

    async getAll(limit: number = 100, offset: number = 0, available?: boolean): Promise<Question[]> {
        let queryText = `
          SELECT q.question_id, q.question_name, q.question_content, q.available,
                 COALESCE(
                   json_agg(
                     json_build_object(
                       'answer_id', a.answer_id,
                       'answer_content', a.answer_content,
                       'is_correct', a.is_correct
                     )
                   ) FILTER (WHERE a.answer_id IS NOT NULL), '[]'
                 ) AS answers
          FROM question q
          LEFT JOIN answer a ON q.question_id = a.question_id
        `;

        const params: any[] = [limit, offset];
        if (available !== undefined) {
            queryText += ` WHERE q.available = $3 `;
            params.push(available);
        }

        queryText += `
          GROUP BY q.question_id
          ORDER BY q.question_id
          LIMIT $1 OFFSET $2;
        `;

        const result = await query(queryText, params);
        return result.rows;
    },

    async create(questions: Question[], exam_id: number): Promise<Question[]> {
        const client = await pool.connect();
        const createdQuestions: Question[] = [];
        try {
            await client.query('BEGIN');

            for (const qa of questions) {
                // insert question
                const qRes = await client.query(
                    `INSERT INTO question (question_name, question_content) 
               VALUES ($1, $2) RETURNING *`,
                    [qa.question_name, qa.question_content]
                );

                const newQuestion: Question = qRes.rows[0];
                newQuestion.answers = [];

                // insert answers
                if (qa.answers && qa.answers.length > 0) {
                    for (const ans of qa.answers) {
                        const aRes = await client.query(
                            `INSERT INTO answer (question_id, answer_content, is_correct) 
                   VALUES ($1, $2, $3) RETURNING *`,
                            [newQuestion.question_id, ans.answer_content, ans.is_correct]
                        );

                        const newAnswer: Answer = aRes.rows[0];
                        newQuestion.answers.push(newAnswer);
                    }
                }

                const newQuestionId = newQuestion.question_id;
                const exam_question: ExamQuestion = {
                    exam_id,
                    question_id: newQuestionId
                }

                await ExamQuestionService.add(
                    { exam_id, question_id: newQuestion.question_id },
                    client
                );
                createdQuestions.push(newQuestion);
            }

            await client.query('COMMIT');
            return createdQuestions;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    // hàm update sẽ cập nhật cả question và answers
    // nếu answer đã có answer_id thì sẽ update, nếu chưa thì sẽ thêm mới vào DB
    async update(question_id: Number, question: Partial<Question>): Promise<Question | null> {
        const client = await pool.connect();
        try {
            const id = question_id;

            await client.query("BEGIN");

            // --- 1. Update question ---
            const allowed = ["question_name", "question_content"];
            const fields: string[] = [];
            const values: any[] = [];
            let idx = 1;

            for (const key of allowed) {
                if ((question as any)[key] !== undefined) {
                    fields.push(`${key} = $${idx}`);
                    values.push((question as any)[key]);
                    idx++;
                }
            }

            let updatedQuestion: Question | null = null;

            if (fields.length > 0) {
                values.push(id);
                const queryText = `
              UPDATE question 
              SET ${fields.join(", ")} 
              WHERE question_id = $${idx} 
              RETURNING *`;
                const result = await client.query(queryText, values);
                updatedQuestion = result.rows[0] || null;
            } else {
                const result = await client.query(
                    `SELECT * FROM question WHERE question_id = $1`,
                    [id]
                );
                updatedQuestion = result.rows[0] || null;
            }

            if (!updatedQuestion) {
                await client.query("ROLLBACK");
                return null;
            }

            // --- 2. Update answers (nếu có) ---
            if (question.answers && question.answers.length > 0) {
                for (const ans of question.answers) {
                    if (ans.answer_id) {
                        // update answer đã có
                        await client.query(
                            `UPDATE answer 
                   SET answer_content = $1, is_correct = $2 
                   WHERE answer_id = $3 AND question_id = $4`,
                            [ans.answer_content, ans.is_correct, ans.answer_id, id]
                        );
                    } else {
                        // thêm mới answer nếu answer đó không có answer_id
                        await client.query(
                            `INSERT INTO answer (question_id, answer_content, is_correct) 
                   VALUES ($1, $2, $3)`,
                            [id, ans.answer_content, ans.is_correct]
                        );
                    }
                }
            }

            // --- 3. Lấy lại toàn bộ question + answers ---
            const answersRes = await client.query(
                `SELECT * FROM answer WHERE question_id = $1`,
                [id]
            );
            updatedQuestion.answers = answersRes.rows;

            await client.query("COMMIT");
            return updatedQuestion;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    },

    async setAvailable(question_id: number, available: boolean): Promise<boolean> {
        const result = await query(
            `UPDATE question SET available = $1 WHERE question_id = $2`,
            [available, question_id]
        );
        return (result.rowCount ?? 0) > 0;
    },

    async remove(id: number): Promise<void> {
        const client = await pool.connect();
        try {
            const question_id = id;

            await client.query('BEGIN');

            // Xoá câu trả lời liên quan
            await client.query(
                'DELETE FROM answer WHERE question_id = $1',
                [question_id]
            );

            // Xoá câu hỏi
            await client.query(
                'DELETE FROM question WHERE question_id = $1',
                [question_id]
            );

            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
};

export default QuestionService;
