import { Router } from 'express';
import ExamController from '../controllers/exam.controller';
import Authentication from '../middleware/authentication';
import { ADMIN } from "../config/permission";
import { ExamQuestionController } from '../controllers/exam.question.controller';
import { ScheduleExamController } from '../controllers/schedule.exam.controller';
import QuestionController from '../controllers/question.controller';

const examRoute = Router();

// EXAM SCHEDULE ROUTES

/**
 * @openapi
 * /exams/schedule:
 *   get:
 *     summary: Lấy danh sách tất cả lịch thi
 *     tags: [Exams]
 *     responses:
 *       200:
 *         description: Lấy danh sách lịch thi thành công
 *       500:
 *         description: Lỗi server
 */
examRoute.get('/schedule',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        ScheduleExamController.getAll);

/**
 * @openapi
 * /exams/schedule/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một lịch thi theo ID
 *     tags: [Exams]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của lịch thi
 *     responses:
 *       200:
 *         description: Lấy thông tin lịch thi thành công
 *       404:
 *         description: Không tìm thấy lịch thi
 *       500:
 *         description: Lỗi server
 */
examRoute.get(
        '/schedule/:id',
        Authentication.AuthenticateToken,
        ScheduleExamController.getById);

/**
 * @openapi
 * /exams/schedule/create:
 *   post:
 *     summary: Tạo lịch thi mới (yêu cầu admin)
 *     tags: [Exams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-20T09:00:00Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-20T11:00:00Z"
 *     responses:
 *       201:
 *         description: Tạo lịch thi thành công
 *       400:
 *         description: Dữ liệu gửi lên không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
examRoute.post(
        '/schedule/create',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        ScheduleExamController.create);

/**
 * @openapi
 * /exams/schedule/update/{id}:
 *   put:
 *     summary: Cập nhật lịch thi (yêu cầu admin)
 *     tags: [Exams]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của lịch thi cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-25T09:00:00Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-25T11:00:00Z"
 *     responses:
 *       200:
 *         description: Cập nhật lịch thi thành công
 *       400:
 *         description: Dữ liệu gửi lên không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy lịch thi
 *       500:
 *         description: Lỗi server
 */
examRoute.put(
  '/schedule/update/:id',
  Authentication.AuthenticateToken,
  Authentication.AuthorizeRoles(ADMIN),
  ScheduleExamController.update
);

/**
 * @openapi
 * /exams/schedule/remove/{id}:
 *   delete:
 *     summary: Xóa lịch thi (yêu cầu admin)
 *     tags: [Exams]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của lịch thi cần xóa
 *     responses:
 *       204:
 *         description: Xóa lịch thi thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy lịch thi
 *       500:
 *         description: Lỗi server
 */
examRoute.delete(
  '/schedule/remove/:id',
  Authentication.AuthenticateToken,
  Authentication.AuthorizeRoles(ADMIN),
  ScheduleExamController.remove);

// EXAM

/**
 * @openapi
 * /exams:
 *   get:
 *     summary: Lấy danh sách đề thi
 *     tags: [Exams]
 *     responses:
 *       200:
 *         description: Danh sách đề thi
 *       500:
 *         description: Lỗi server
 */
examRoute.get('/', ExamController.getAll);

/**
 * @openapi
 * /exams/{id}:
 *   get:
 *     summary: Lấy thông tin đề thi theo ID
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách đề thi
 *       500:
 *         description: Lỗi server
 */
examRoute.get('/:id', ExamController.getById);

/**
 * @openapi
 * /exams/create:
 *   post:
 *     summary: Tạo đề thi mới (yêu cầu admin)
 *     tags: [Exams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exam_name:
 *                 type: string
 *                 example: "Đề thi giữa kỳ"
 *               topic_id:
 *                 type: integer
 *                 example: 1
 *               time_limit:
 *                 type: integer
 *                 example: 60
 *               exam_schedule_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tạo đề thi thành công
 *       400:
 *         description: Dữ liệu gửi lên không hợp lệ
 *       500:
 *         description: Lỗi server
 */
examRoute.post('/create',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        ExamController.create);

        
/**
 * @openapi
 * /exams/update/{id}:
 *   patch:
 *     summary: Cập nhật đề thi (yêu cầu admin)
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đề thi cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Đề thi giữa kỳ"
 *               topic_id:
 *                 type: integer
 *                 example: 1
 *               time_limit:
 *                 type: integer
 *                 example: 60
 *               exam_schedule_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       202:
 *         description: Cập nhật đề thi thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy đề thi
 *       500:
 *         description: Lỗi server
 */
examRoute.patch('/update/:id',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        ExamController.update);

/**
 * @openapi
 * /exams/setAvailable/{id}:
 *   patch:
 *     summary: Thay đổi trạng thái đề thi theo ID (yêu cầu admin)
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đề thi cần thay đổi trạng thái
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             available: false
 *     responses:
 *       204:
 *         description: Cập nhật trạng thái thành công
 *       404:
 *         description: Không tìm thấy đề thi
 *       500:
 *         description: Lỗi server
 */
examRoute.patch('/setAvailable/:id',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        ExamController.setAvailable);

 /**
 * @openapi
 * /exams/create/questions/{id}:
 *   post:
 *     summary: Tạo nhiều câu hỏi mới (Yêu cầu admin)
 *     tags:
 *       - Question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_name:
 *                       type: string
 *                       example: "Định luật II Newton"
 *                     question_content:
 *                       type: string
 *                       example: "Lực bằng khối lượng nhân gia tốc là phát biểu của định luật nào?"
 *                     answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           answer_content:
 *                             type: string
 *                             example: "Định luật II Newton"
 *                           is_correct:
 *                             type: boolean
 *                             example: true
 *           example:
 *             questions:
 *               - question_name: "Định luật II Newton"
 *                 question_content: "Lực bằng khối lượng nhân gia tốc là phát biểu của định luật nào?"
 *                 answers:
 *                   - answer_content: "Định luật I Newton"
 *                     is_correct: false
 *                   - answer_content: "Định luật II Newton"
 *                     is_correct: true
 *               - question_name: "Thủ đô của Việt Nam"
 *                 question_content: "Thành phố nào là thủ đô của Việt Nam?"
 *                 answers:
 *                   - answer_content: "Hà Nội"
 *                     is_correct: true
 *                   - answer_content: "TP. Hồ Chí Minh"
 *                     is_correct: false
 *     responses:
 *       201:
 *         description: Tạo câu hỏi thành công
 *       500:
 *         description: Lỗi server
 */
examRoute.post('/questions/create/:id',
Authentication.AuthenticateToken,
Authentication.AuthorizeRoles(ADMIN),
QuestionController.create);

/**
 * @openapi
 * /exams/remove/{id}:
 *   delete:
 *     summary: Xóa một đề thi theo ID (yêu cầu admin)
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đề thi cần xóa
 *     responses:
 *       204:
 *         description: Xóa đề thi thành công
 *       404:
 *         description: Không tìm thấy đề thi
 *       500:
 *         description: Lỗi server
 */
examRoute.delete('/remove/:id',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        ExamController.remove);

/**
 * @swagger
 * /exams/questions/add/{id}:
 *   post:
 *     summary: Thêm câu hỏi vào đề thi (yêu cầu đăng nhập)
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đề thi (exam)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_id:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - question_id
 *     responses:
 *       201:
 *         description: Thêm câu hỏi vào đề thi thành công
 *       500:
 *         description: Lỗi server
 */

examRoute.post("/questions/add/:id",
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        ExamQuestionController.add);

/**
 * @swagger
 * /exams/questions/remove/{id}:
 *   delete:
 *     summary: Xóa câu hỏi khỏi đề thi (yêu cầu đăng nhập)
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đề thi (exam)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_id:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - question_id
 *     responses:
 *       200:
 *         description: Xóa câu hỏi khỏi đề thi thành công
 *       404:
 *         description: Không tìm thấy đề thi
 */
examRoute.delete("/questions/remove/:id",
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        ExamQuestionController.remove);

export default examRoute;
