import { query } from "../config/database";
import { ExamQuestion } from "../model/exam.question.model";

export const ExamQuestionService = {
    async add(selectedQuestions: { exam_id: number; question_id: number }[]) {
        const results = [];

        for (const q of selectedQuestions) {
            const res = await query(
                `INSERT INTO question_exam (exam_id, question_id)
                 VALUES ($1, $2)
                 RETURNING *`,
                [q.exam_id, q.question_id]
            );
            results.push(res.rows[0]);
        }

        return results;
    },

    async remove(data: ExamQuestion): Promise<boolean> {
        const result = await query(
            `DELETE FROM question_exam WHERE exam_id = $1 AND question_id = $2`,
            [data.exam_id, data.question_id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}