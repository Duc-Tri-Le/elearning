import { query } from "../config/database";
import { ScheduleExam } from "../model/schedule.exam.model";

export const ScheduleExamService = {
        // ✅ Lấy danh sách tất cả lịch thi (có phân trang)
        async getAll(limit: number = 100, offset: number = 0): Promise<ScheduleExam[]> {
                const queryText = `
                SELECT * 
                FROM exam_schedule 
                ORDER BY exam_schedule_id 
                LIMIT $1 OFFSET $2`;
                console.log(queryText);
                const result = await query(queryText, 
                        [limit, offset]);
                return result.rows as ScheduleExam[];
        },

        // ✅ Lấy lịch thi theo ID + danh sách đề thi
        async getById(id: number): Promise<ScheduleExam | null> {
                const queryText = `
                SELECT e.exam_name, e.topic_id, e.time_limit, e.exam_id, e.created_at, t.title
                FROM exam_schedule s
                JOIN exam e ON s.exam_schedule_id = e.exam_schedule_id
                JOIN topic t ON t.topic_id = e.topic_id
                WHERE s.exam_schedule_id = $1 AND e.available =true`;
                const result = await query(queryText, [id]);

                // Lấy thông tin cơ bản của lịch thi (từ dòng đầu tiên)
                const scheduleQuery = await query(
                        `SELECT * FROM exam_schedule WHERE exam_schedule_id = $1`,
                        [id]
                );
                const schedule = scheduleQuery.rows[0];

                // Gắn danh sách exam vào
                const scheduleWithExams = {
                        ...schedule,
                        exams: result.rows.length > 0 ? result.rows : [], // danh sách các đề thi trong lịch này
                };

                return scheduleWithExams as ScheduleExam;
        },

        // ✅ Tạo mới lịch thi
        async create(data: ScheduleExam): Promise<ScheduleExam> {
                const queryText = `
                INSERT INTO exam_schedule (start_time, end_time)
                VALUES ($1, $2)
                RETURNING *`;
                const result = await query(queryText, [
                        data.start_time,
                        data.end_time
                ]);
                return result.rows[0];
        },

        // ✅ Cập nhật lịch thi
        async update(id: number, data: ScheduleExam): Promise<ScheduleExam | null> {
                const queryText = `
                UPDATE exam_schedule
                SET     
                start_time = $1, 
                end_time = $2
                WHERE exam_schedule_id = $3
                RETURNING *`;
                const result = await query(queryText, [
                        data.start_time,
                        data.end_time,
                        id
                ]);
                return result.rows[0] || null;
        },

        // ✅ Xoá lịch thi
        async remove(id: number): Promise<boolean> {
                const result = await query(
                        "DELETE FROM exam_schedule WHERE exam_schedule_id = $1",
                        [id]
                );
                return (result.rowCount ?? 0) > 0;
        },
};


