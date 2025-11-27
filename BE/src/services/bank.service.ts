import pool, { query } from "../config/database";
import { Bank } from "../model/bank.model";
import { Question } from "../model/question.model";

const BankService = {
    async getById(id: number): Promise<Question[] | null> {
        const queryText = `
          SELECT q.*
          FROM bank b
          JOIN question_bank qb ON b.bank_id = qb.bank_id
          JOIN question q ON qb.question_id = q.question_id
          WHERE b.bank_id = $1
        `;
        const result = await query(queryText, [id]);
        if (!result.rows.length) return null;

        // Lấy danh sách question_id
        const questionIds = result.rows.map(q => q.question_id);
        const ansRes = await query(
            'SELECT * FROM answer WHERE question_id = ANY($1)',
            [questionIds]
        );

        // Gom answer theo question_id
        const answerMap = ansRes.rows.reduce((acc, ans) => {
            (acc[ans.question_id] ||= []).push(ans);
            return acc;
        }, {} as Record<number, any[]>);

        // Gắn answers vào từng question
        const questions = result.rows.map(q => ({
            ...q,
            answers: answerMap[q.question_id] || []
        }));

        return questions as Question[];
    },

    async create(bank: Bank): Promise<Bank> {
        const queryText = `
            INSERT INTO bank (description, topic_id)
            VALUES ($1, $2) RETURNING *`;
        const result = await query(queryText, [bank.description, bank.topic_id]);
        return result.rows[0];
    },

    async update(id: number, data: Bank): Promise<Bank | null> {
        const queryTextBase = 'UPDATE bank SET description = $1, topic_id = $2 WHERE bank_id = $3 RETURNING *';
        const result = await query(queryTextBase, [data.description, data.topic_id, id]);
        return result.rows[0] || null;
    },

    async setAvailable(id: number, available: boolean): Promise<boolean> {
        const result = await query(
            "UPDATE bank SET available = $1 WHERE bank_id = $2",
            [available, id]
        );
        return (result.rowCount ?? 0) > 0;
    },

    async remove(id: number): Promise<boolean> {
        const queryText = 'DELETE FROM bank WHERE bank_id = $1';
        const result = await query(queryText, [id]);
        return (result.rowCount ?? 0) > 0;
    },

    async list(page: number, searchValue: string, topicIds: number[]): Promise<({ banks: Bank[]; totalPages: number }) | []> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const limit = 12;
            const offset = (page - 1) * limit;

            let conditions = [];
            let params = [];
            let idx = 1;

            // dieu kien loc bai luyen tap 
            conditions.push(`b.available = true`);

            // Search
            if (searchValue.trim() !== "") {
                conditions.push(`(LOWER(b.description) LIKE LOWER($${idx}))`);
                params.push(`%${searchValue}%`);
                idx++;
            }

            // Topic filter
            if (topicIds.length > 0) {
                conditions.push(`b.topic_id = ANY($${idx})`);
                params.push(topicIds);
                idx++;
            }

            const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

            const queryText = `
                SELECT 
                    b.*,
                    t.title
                FROM bank b
                JOIN topic t ON b.topic_id = t.topic_id
                ${whereClause}
                ORDER BY b.bank_id DESC
                LIMIT ${limit} OFFSET ${offset}
                `;

            const result = await client.query(queryText, params);

            // Count total
            const countQuery = `
                SELECT COUNT(*) AS total
                FROM bank b
                ${whereClause}
                `;

            const countResult = await client.query(countQuery, params);

            const totalPages = Math.ceil(countResult.rows[0].total / limit);

            await client.query("COMMIT");

            return { banks: result.rows, totalPages };

        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Lỗi khi lọc bài thi:", error);
            return [];
        } finally {
            client.release();
        }
    }
};

export default BankService;