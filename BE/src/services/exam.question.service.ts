import { query } from "../config/database";
import { BankQuestion } from "../model/bank.question.model";
import { ExamQuestion } from "../model/exam.question.model";
import pool from "../config/database";

export const ExamQuestionService = {
    async add(exam_question: { exam_id: number; question_id: number }, client?: any) {
        const executor = client || (await pool.connect());
        try {
            const res = await executor.query(
                `INSERT INTO question_exam (exam_id, question_id)
             VALUES ($1, $2) RETURNING *`,
                [exam_question.exam_id, exam_question.question_id]
            );
            return res.rows[0];
        } finally {
            if (!client) executor.release(); 
        }
    },

    async remove(data: ExamQuestion): Promise<boolean> {
        const result = await query(
            `DELETE FROM question_exam WHERE exam_id = $1 AND question_id = $2`,
            [data.exam_id, data.question_id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}