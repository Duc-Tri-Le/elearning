import { Request, Response } from "express";
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import ExamService from "../services/exam.service";
import { Exam } from "../model/exam.model";

const ExamController = {
  async getAll(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 200,
        message: "Lấy danh sách đề thi thành công",
        data: await ExamService.getAll(Number(req.query.page)),
      };
    });

    return res.status(result.status).json(result);
  },

  async getById(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 200,
        message: "Lấy thông tin đề thi thành công",
        data: await ExamService.getById(Number(req.params.id)),
      };
    });

    return res.status(result.status).json(result);
  },

  async create(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 201,
        message: "Tạo đề thi thành công",
        data: await ExamService.create({ ...req.body } as Exam),
      };
    });

    return res.status(result.status).json(result);
  },

  async update(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 202,
        message: "Cập nhật đề thi thành công",
        data: await ExamService.update(Number(req.params.id), req.body),
      };
    });

    return res.status(result.status).json(result);
  },

  async setAvailable(req: Request, res: Response) {

    const result: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 202,
        message: "Đổi trạng thái đề thi thành công",
        data: await ExamService.setAvailable(
          Number(req.params.id),
          Boolean(req.body.available)
        ),
      };
    });

    return res.status(result.status).json(result);
  },

  async remove(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {

      return {
        status: 204,
        message: "Xóa đề thi thành công",
        data: await ExamService.remove(Number(req.params.id)),
      };
    });

    return res.status(result.status).json(result);
  },
};

export default ExamController;
