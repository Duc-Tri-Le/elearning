import { Request, Response } from "express";
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import { ScheduleExamService } from "../services/schedule.exam.service";
import { ScheduleExam } from "../model/schedule.exam.model";

export const  ScheduleExamController = {
    // ✅ Lấy danh sách tất cả lịch thi
    async getAll(req: Request, res: Response) {
        console.log("ScheduleExamController.getAll called");
        const result: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 200,
                message: "Lấy danh sách lịch thi thành công",
                data: await ScheduleExamService.getAll(),
            };
        });

        return res.status(result.status).json(result);
    },

    // ✅ Lấy chi tiết lịch thi theo ID
    async getById(req: Request, res: Response) {
        const result: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 200,
                message: "Lấy thông tin lịch thi thành công",
                data: await ScheduleExamService.getById(Number(req.params.id)),
            };
        });

        return res.status(result.status).json(result);
    },

    // ✅ Tạo lịch thi mới
    async create(req: Request, res: Response) {
        const result: DefaultResponse<any> = await safeExecute(async () => {
            console.log(req.body);
            
            return {
                status: 201,
                message: "Tạo lịch thi thành công",
                data: await ScheduleExamService.create({
                    ...req.body,
                } as ScheduleExam),
            };
        });

        return res.status(result.status).json(result);
    },

    // ✅ Cập nhật thông tin lịch thi
    async update(req: Request, res: Response) {
        const result: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 202,
                message: "Cập nhật lịch thi thành công",
                data: await ScheduleExamService.update(
                    Number(req.params.id),
                    req.body as ScheduleExam)
            };
        });

        return res.status(result.status).json(result);
    },

    // ✅ Xóa lịch thi
    async remove(req: Request, res: Response) {
        const result: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 204,
                message: "Xóa lịch thi thành công",
                data: await ScheduleExamService.remove(Number(req.params.id)),
            };
        });

        return res.status(result.status).json(result);
    },
};
