import { Exam } from "../model/exam.model";
import pool, { query } from "../config/database";
import { Question } from "../model/question.model";

const ExamService = {
  async getAll(page: number): Promise<{ data: Exam[]; totalPages: number } | []> {

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const limit: number = 12
      const offset = (page - 1) * limit;
      const queryText = `SELECT 
        e.exam_name, e.topic_id, e.time_limit, e.exam_id, e.created_at, e.available,
        t.title,
        es.start_time, es.end_time
        FROM exam e
        JOIN topic t ON e.topic_id = t.topic_id
        JOIN exam_schedule es ON es.exam_schedule_id = e.exam_schedule_id
        WHERE e.available = true
        ORDER BY exam_id DESC LIMIT $1 OFFSET $2`;
      const result = await query(queryText, [limit, offset]);

      const countResult = await client.query(
        "SELECT COUNT(*) as total FROM exam WHERE available = true"
      );

      const totalItems = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalItems / limit);

      await client.query("COMMIT");

      return { data: result.rows, totalPages };
    } catch (error) {
      console.error("Lỗi khi thêm flashcard:", error);
      return [];
    } finally {
      client.release();
    }
  },

  async getById(id: number): Promise<Question[] | null> {
    const queryText = `
          SELECT q.*
          FROM exam b
          JOIN question_exam qb ON b.exam_id = qb.exam_id
          JOIN question q ON qb.question_id = q.question_id
          WHERE b.exam_id = $1
        `;
    const result = await query(queryText, [id]);
    if (!result.rows.length) return null;

    // Lấy danh sách question_id
    const questionIds = result.rows.map((q) => q.question_id);
    const ansRes = await query(
      "SELECT answer_id, question_id, answer_content FROM answer WHERE question_id = ANY($1)",
      [questionIds]
    );

    // Gom answer theo question_id
    const answerMap = ansRes.rows.reduce((acc, ans) => {
      (acc[ans.question_id] ||= []).push(ans);
      return acc;
    }, {} as Record<number, any[]>);

    // Gắn answers vào từng question
    const questions = result.rows.map((q) => ({
      ...q,
      answers: answerMap[q.question_id] || [],
    }));

    return questions as Question[];
  },

  async create(data: Exam): Promise<Exam> {
    const queryText = `
      INSERT INTO exam (exam_name, topic_id, time_limit, exam_schedule_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await query(queryText, [
      data.exam_name,
      data.topic_id,
      data.time_limit,
      data.exam_schedule_id,
    ]);
    return result.rows[0];
  },

  async update(id: number, data: Exam): Promise<Exam | null> {
    const queryText = `
      UPDATE exam
      SET exam_name = $1, topic_id = $2, time_limit = $3, exam_schedule_id = $4
      WHERE exam_id = $5
      RETURNING *
    `;
    const result = await query(queryText, [
      data.exam_name,
      data.topic_id,
      data.time_limit,
      data.exam_schedule_id,
      data.exam_id,
    ]);
    return result.rows[0] || null;
  },

  async setAvailable(id: number, available: boolean): Promise<boolean> {
    const result = await query(
      "UPDATE exam SET available = $1 WHERE exam_id = $2",
      [available, id]
    );
    return (result.rowCount ?? 0) > 0;
  },

  async remove(id: number): Promise<boolean> {
    const result = await query("DELETE FROM exam WHERE exam_id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  },

  async search(searchValue: string, page: number): Promise<{ data: Exam[]; totalPages: number } | []> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      
      const limit: number = 12
      const offset = (page - 1) * limit;
      const keyword = `%${searchValue}%`;
      const queryText = `
        SELECT 
          e.exam_name, e.topic_id, e.time_limit, e.exam_id, e.created_at, e.available,
          t.title,
          es.start_time, es.end_time
        FROM exam e
        JOIN topic t ON e.topic_id = t.topic_id
        JOIN exam_schedule es ON es.exam_schedule_id = e.exam_schedule_id
        WHERE e.available = true
          AND (LOWER(e.exam_name) LIKE LOWER($1) OR LOWER(t.title) LIKE LOWER($1))
        ORDER BY e.exam_id DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await query(queryText, [keyword, limit, offset]);

      const countResult = await client.query(
        "SELECT COUNT(*) as total FROM exam WHERE available = true"
      );

      const totalItems = parseInt(countResult.rows[0].total, 10);
      const totalPages = Math.ceil(totalItems / limit);

      await client.query("COMMIT");

      return { data: result.rows, totalPages };
    } catch (error) {
      console.error("Lỗi khi thêm flashcard:", error);
      return [];
    } finally {
      client.release();
    }
  }

};

export default ExamService;
