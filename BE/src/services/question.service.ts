import { query } from "../config/database";
import pool from "../config/database";
import { Question } from "../model/question.model";
import { Answer } from "../model/answer.model";

const QuestionService = {
    async get(question_ids: number[]): Promise<Question[]> {
        if (!question_ids || question_ids.length === 0) {
            return [];
        }

        const queryText = 'SELECT * FROM question WHERE question_id = ANY($1)';
        const result = await query(queryText, [question_ids]);

        return result.rows;
    },

    async getAll(page: number, available?: boolean): Promise<{ question: Question[]; totalPages: number } | []> {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const limit = 12;
            const offset = (page - 1) * limit;

            // Xây dựng câu query chính
            let queryText = `
            SELECT 
              q.question_id,
              q.question_name,
              q.question_content,
              q.available,
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
            WHERE q.available = true
          `;

            const params: any[] = [];
            let whereClause = "";
            let paramIndex = 1;

            if (available !== undefined) {
                whereClause = ` WHERE q.available = $${paramIndex}`;
                params.push(available);
                paramIndex++;
            }

            queryText += `${whereClause}
            GROUP BY q.question_id
            ORDER BY q.question_id DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
          `;

            params.push(limit, offset);

            // Truy vấn dữ liệu chính
            const result = await client.query(queryText, params);

            // Đếm tổng số bản ghi để tính totalPages
            let countQuery = `SELECT COUNT(*) as total FROM question`;
            const countParams: any[] = [];

            if (available !== undefined) {
                countQuery += ` WHERE available = $1`;
                countParams.push(available);
            }

            const countResult = await client.query(countQuery, countParams);

            const totalItems = parseInt(countResult.rows[0].total, 10);
            const totalPages = Math.ceil(totalItems / limit);

            await client.query("COMMIT");

            return { question: result.rows, totalPages };
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Lỗi khi lấy danh sách câu hỏi:", error);
            return [];
        } finally {
            client.release();
        }
    },

    async create(questions: Question[]): Promise<Question[]> {
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
    },

    async searchQuestions(
        searchValue: string,
        page: number
    ): Promise<{ data: Question[]; totalPages: number } | []> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const limit = 12;
            const offset = (page - 1) * limit;
            const keyword = `%${searchValue}%`;

            // Lấy questions + answers
            const queryText = `
            SELECT 
              q.question_id,
              q.question_name,
              q.question_content,
              q.available,
              a.answer_id,
              a.answer_content,
              a.is_correct
            FROM question q
            LEFT JOIN answer a ON a.question_id = q.question_id
            WHERE LOWER(q.question_name) LIKE LOWER($1)
            OR LOWER(q.question_content) LIKE LOWER($1)
            ORDER BY q.question_id DESC
            LIMIT $2 OFFSET $3
          `;

            const result = await client.query(queryText, [keyword, limit, offset]);

            // Đếm tổng số question (không đếm answer)
            const countResult = await client.query(
                `
            SELECT COUNT(*) as total
            FROM question q
            WHERE LOWER(q.question_name) LIKE LOWER($1)
               OR LOWER(q.question_content) LIKE LOWER($1)
            `,
                [keyword]
            );

            const totalItems = parseInt(countResult.rows[0].total, 10);
            const totalPages = Math.ceil(totalItems / limit);

            // Gom dữ liệu answers vào từng question
            const questionsMap: Record<number, Question> = {};
            result.rows.forEach((row) => {
                if (!questionsMap[row.question_id]) {
                    questionsMap[row.question_id] = {
                        question_id: row.question_id,
                        question_name: row.question_name,
                        question_content: row.question_content,
                        available: row.available,
                        source : row.source,
                        answers: [],
                    };
                }
                if (row.answer_id) {
                    questionsMap[row.question_id].answers?.push({
                        answer_id: row.answer_id,
                        answer_content: row.answer_content,
                        question_id : row.question_id,
                        is_correct: row.is_correct,
                    });
                }
            });

            await client.query("COMMIT");

            return { data: Object.values(questionsMap), totalPages };
        } catch (error) {
            console.error("Lỗi khi lấy câu hỏi:", error);
            return [];
        } finally {
            client.release();
        }
    },

    async filterQuestions(
        question_name: string,
        source: string,
        status: string,
        page: number
    ): Promise<{ questions: Question[]; totalPages: number } | []> {
        const client = await pool.connect();
    
        try {
            await client.query("BEGIN");
    
            const limit = 12;
            const offset = (page - 1) * limit;
    
            const isAvailable = status === "All" ? [true, false] : [status === "true"];
            const params: any[] = [isAvailable];
            let queryText = `
                SELECT
                  q.question_id,
                  q.question_name,
                  q.question_content,
                  q.available,
                  q.source,
                  a.answer_id,
                  a.answer_content,
                  a.is_correct
                FROM question q
                LEFT JOIN answer a ON a.question_id = q.question_id
                WHERE q.available = ANY($1)
                
            `;
    
            // Nếu có question_name, có source thì tìm theo source
            if (question_name) {
                params.push(`%${question_name}%`);
                queryText += ` AND q.question_name ILIKE $${params.length}`;
            }
            
            if (source) {
                params.push(source);
                queryText += ` AND q.source = $${params.length}`;
            }
    
            params.push(limit, offset);
            queryText += ` ORDER BY q.question_id DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;
    
            const result = await client.query(queryText, params);
    
            // Count tổng question
            const countParams : any[] = [isAvailable];
            let countQuery = `SELECT COUNT(*) AS total FROM question q WHERE q.available = ANY($1)`;
            if (question_name && question_name.trim() !== "") {
                countParams.push(`%${question_name}%`);
                countQuery += ` AND q.question_name ILIKE $${countParams.length}`;
            }
            
            if (source && source !== "All") {
                countParams.push(source);
                countQuery += ` AND q.source = $${countParams.length}`;
            }
            const countResult = await client.query(countQuery, countParams);
            const totalItems = parseInt(countResult.rows[0].total, 10);
            const totalPages = Math.ceil(totalItems / limit);
    
            const questionsMap: Record<number, Question> = {};
            result.rows.forEach((row) => {
                if (!questionsMap[row.question_id]) {
                    questionsMap[row.question_id] = {
                        question_id: row.question_id,
                        question_name: row.question_name,
                        question_content: row.question_content,
                        available: row.available,
                        source: row.source || "",
                        answers: [],
                    };
                }
                if (row.answer_id) {
                    questionsMap[row.question_id].answers?.push({
                        answer_id: row.answer_id,
                        answer_content: row.answer_content,
                        question_id: row.question_id,
                        is_correct: row.is_correct,
                    });
                }
            });
    
            await client.query("COMMIT");
            return { questions: Object.values(questionsMap), totalPages };
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Lỗi khi lọc câu hỏi:", error);
            return { questions: [], totalPages: 0 };
        } finally {
            client.release();
        }
    }    
};

export default QuestionService;
