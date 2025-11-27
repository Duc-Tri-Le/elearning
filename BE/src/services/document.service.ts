import { get } from "http";
import { query } from "../config/database";
import { Document } from "../model/document.model";
import pool from "../config/database";

const DocumentService = {
    async getAll(page: number = 1): Promise<{ document: Document[]; totalPages: number } | []> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const limit = 12;
            const offset = (page - 1) * limit;

            // Lấy danh sách document kèm tên topic
            const queryText = `
            SELECT 
              d.document_id,
              d.title,
              d.link,
              d.topic_id,
              d.available,
              d.embedding,
              d.created_at,
              t.title AS topic_title
            FROM document d
            JOIN topic t ON d.topic_id = t.topic_id
            WHERE d.available = true
            ORDER BY d.document_id DESC
            LIMIT $1 OFFSET $2
          `;

            const result = await client.query(queryText, [limit, offset]);

            // Đếm tổng số document
            const countResult = await client.query(
                "SELECT COUNT(*) as total FROM document WHERE available = true"
            );

            const totalItems = parseInt(countResult.rows[0].total, 10);
            const totalPages = Math.ceil(totalItems / limit);

            await client.query("COMMIT");

            return { document: result.rows, totalPages };
        } catch (error) {
            console.error("Lỗi khi lấy danh sách tài liệu:", error);
            await client.query("ROLLBACK");
            return [];
        } finally {
            client.release();
        }
    },

    async create(document: Document, fileLink : string): Promise<Document | null> {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const result = await client.query(
                `INSERT INTO document (title, link, topic_id)
                 VALUES ($1, $2, $3)
                 RETURNING document_id, title, link, embedding, created_at, available, topic_id`,
                [document.title, fileLink, document.topic_id]
            );

            const newDocument: Document = result.rows[0];

            // await client.query(
            //     `INSERT INTO document_history (document_id) 
            //      VALUES ($1)`,
            //     [newDocument.document_id]
            // );

            await client.query("COMMIT");
            return newDocument;
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    },

    async update(id: number, document: Partial<Document>): Promise<Document> {
        const client = await pool.connect();
        try {
            if (!id) {
                throw new Error("document_id isn't exist");
            }

            await client.query("BEGIN");

            // chỉ cho phép update title, link, topic_id
            const allowed = ["title", "link", "topic_id"];
            const fields: string[] = [];
            const values: any[] = [];
            let idx = 1;

            for (const key of allowed) {
                const value = (document as any)[key];
                if (value !== undefined) {
                    fields.push(`${key} = $${idx}`);
                    values.push(value);
                    idx++;
                }
            }

            if (fields.length === 0) {
                throw new Error("No valid fields provided for update");
            }

            values.push(id);
            const queryText = `
                UPDATE document 
                SET ${fields.join(", ")} 
                WHERE document_id = $${idx} 
                RETURNING *`;
            const result = await client.query(queryText, values);

            await client.query("COMMIT");
            return result.rows[0];
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
    },

    async setAvailable(id: number, available: boolean): Promise<boolean> {
        const result = await query('UPDATE document SET available = $1 WHERE document_id = $2', [available, id]);
        return (result.rowCount ?? 0) > 0;
    },

    async remove(id: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Xóa document 
            await client.query('DELETE FROM document WHERE document_id = $1', [id]);

            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    async search(searchValue: string, page: number): Promise<{ data: Document[]; totalPages: number } | []> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const limit = 12;
            const offset = (page - 1) * limit;
            const keyword = `%${searchValue}%`;

            const queryText = `
                SELECT 
                d.document_id, d.title, d.link, d.created_at, d.available 
                t.topic_id, t.title AS topic_title
                FROM document d
                LEFT JOIN topic t ON d.topic_id = t.topic_id
                WHERE LOWER(d.title) LIKE LOWER($1)
                OR LOWER(t.title) LIKE LOWER($1)
                ORDER BY d.document_id DESC
                LIMIT $2 OFFSET $3
            `;

            const result = await client.query(queryText, [keyword, limit, offset]);

            const countResult = await client.query(
                `
                SELECT COUNT(*) AS total
                FROM document d
                LEFT JOIN topic t ON d.topic_id = t.topic_id
                WHERE LOWER(d.title) LIKE LOWER($1)
                OR LOWER(t.title) LIKE LOWER($1)
                `,
                [keyword]
            );

            const totalItems = parseInt(countResult.rows[0].total, 10);
            const totalPages = Math.ceil(totalItems / limit);

            await client.query("COMMIT");
            return { data: result.rows, totalPages };
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Lỗi khi tìm kiếm tài liệu:", error);
            return [];
        } finally {
            client.release();
        }
    },

    async filter(topicIds: number[], status: string, page: number): Promise<{ data: Document[]; totalPages: number } | []> {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            const limit = 12;
            const offset = (page - 1) * limit;

            // ✅ Xử lý trạng thái hoạt động
            let isAvailable: boolean[] = [];
            if (status.toLowerCase() === "all") {
                isAvailable = [true, false];
            } else {
                isAvailable = [status === "true"];
            }

            // Câu truy vấn chính
            const queryText = `
            SELECT 
              d.document_id, d.title, d.link, d.created_at, d.available,
              t.topic_id, t.title AS topic_title
            FROM document d
            LEFT JOIN topic t ON d.topic_id = t.topic_id
            WHERE d.available = ANY($1::boolean[])
              AND ($2::int[] IS NULL OR d.topic_id = ANY($2))
            ORDER BY d.document_id DESC
            LIMIT $3 OFFSET $4
          `;

            const result = await client.query(queryText, [isAvailable, topicIds.length ? topicIds : null, limit, offset]);

            //  Đếm tổng số kết quả
            const countResult = await client.query(
                `
            SELECT COUNT(*) AS total
            FROM document
            WHERE available = ANY($1::boolean[])
              AND ($2::int[] IS NULL OR topic_id = ANY($2))
            `,
                [isAvailable, topicIds.length ? topicIds : null]
            );

            const totalItems = parseInt(countResult.rows[0].total, 10);
            const totalPages = Math.ceil(totalItems / limit);

            await client.query("COMMIT");
            return { data: result.rows, totalPages };
        } catch (error) {
            await client.query("ROLLBACK");
            console.error("Lỗi khi lọc tài liệu:", error);
            return [];
        } finally {
            client.release();
        }
    }
}
export default DocumentService;