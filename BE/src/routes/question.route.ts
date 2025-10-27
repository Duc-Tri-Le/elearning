import { Router } from 'express';
import QuestionController from '../controllers/question.controller';
import Authentication from '../middleware/authentication';
import { ADMIN } from "../config/permission";

const questionRoute = Router();

/**
 * @openapi
 * /questions:
 *   get:
 *     summary: Lấy danh sách câu hỏi [hiện tại max 100 câu]
 *     tags:
 *       - Question
 *     responses:
 *       200:
 *         description: Danh sách câu hỏi
 *       500:
 *         description: Lỗi server
 */
questionRoute.get('/', QuestionController.getAll);

/**
 * @openapi
 * /questions/update/{id}:
 *   patch:
 *     summary: Cập nhật một phần thông tin câu hỏi và câu trả lời (Yêu cầu admin)
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của câu hỏi cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             question_name: "Định luật II Newton (bản cập nhật)"
 *             question_content: "F = m * a (cập nhật)"
 *             answers:
 *               - answer_id: 54
 *                 answer_content: "Định luật I Newton (cập nhật)"
 *                 is_correct: false
 *               - answer_id: 55
 *                 answer_content: "Định luật II Newton (cập nhật)"
 *                 is_correct: true
 *               - answer_content: "Định luật III Newton (thêm mới)"
 *                 is_correct: false
 *     responses:
 *       202:
 *         description: Cập nhật câu hỏi thành công
 *       404:
 *         description: Không tìm thấy câu hỏi
 *       500:
 *         description: Lỗi server
 */

questionRoute.patch('/update/:id',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        QuestionController.update);

/**
 * @openapi
 * /questions/remove/{id}:
 *   delete:
 *     summary: Xóa một câu hỏi theo ID (Yêu cầu admin)
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của câu hỏi cần xóa
 *     responses:
 *       204:
 *         description: Xóa câu hỏi thành công
 *       404:
 *         description: Không tìm thấy câu hỏi
 *       500:
 *         description: Lỗi server
 */
questionRoute.delete('/remove/:id',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        QuestionController.remove);

/**
 * @openapi
 * /questions/setAvailable/{id}:
 *   patch:
 *     summary: Thay đổi trạng thái available của câu hỏi theo ID (Yêu cầu admin)
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của câu hỏi cần thay đổi
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
 *         description: Không tìm thấy câu hỏi
 *       500:
 *         description: Lỗi server
 */
questionRoute.patch('/setAvailable/:id',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        QuestionController.setAvailable);

export default questionRoute;
