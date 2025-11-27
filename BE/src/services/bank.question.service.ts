import { query } from "../config/database";
import { BankQuestion } from "../model/bank.question.model";


export const BankQuestionService = {
    async add(data: BankQuestion): Promise<BankQuestion> {
        const result = await query(
            `INSERT INTO question_bank (bank_id, question_id)
             VALUES ($1, $2)
             RETURNING *`,
            [data.bank_id, data.question_id]
        );
        return result.rows[0];
    },

    async remove(data: BankQuestion): Promise<boolean> {
        const result = await query(
            `DELETE FROM question_bank WHERE bank_id = $1 AND question_id = $2`,
            [data.bank_id, data.question_id]
        );
        return (result.rowCount ?? 0) > 0;
    }
}