import { get } from "http";
import { query } from "../config/database";
import { Document } from "../model/document.model";
import pool from "../config/database";

const DocumentService = {
    // async get(document_ids: number[]): Promise<Document[]> {
    //     if (!document_ids || document_ids.length === 0) {
    //         return [];
    //     }

    //     const queryText = 'SELECT * FROM document WHERE document_id = ANY($1)';
    //     const result = await query(queryText, [document_ids]);

    //     return result.rows;
    // },

    async getAll(limit: number = 100, offset: number = 0): Promise<Document[]> {
        const queryText = 'SELECT * FROM document ORDER BY document_id LIMIT $1 OFFSET $2';
        const result = await query(queryText, [limit, offset]);

        return result.rows;
    },

    async create(document: Document): Promise<Document | null> {
        const client = await pool.connect();
    
        try {
            await client.query("BEGIN");
    
            const result = await client.query(
                `INSERT INTO document (title, link, topic_id) 
                 VALUES ($1, $2, $3) 
                 RETURNING *`,
                [document.title, document.link, document.topic_id]
            );
    
            const newDocument: Document = result.rows[0];
    
            await client.query(
                `INSERT INTO document_history (document_id) 
                 VALUES ($1)`,
                [newDocument.document_id]
            );
    
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

}
export default DocumentService;