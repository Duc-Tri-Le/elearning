import { Request, Response } from "express";
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import ExamService from "../services/exam.service";
import { Exam } from "../model/exam.model";

const ExamController = {
  async list(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {
      const page = Number(req.query.page) || 1;
      const status = req.query.status?.toString() || "true";
      const searchValue = req.query.search?.toString() || "";
      const topicIds = req.query.topics
        ? req.query.topics.toString().split(",").map(Number)
        : [];
      
      return {
        status: 200,
        message: "Lấy danh sách đề thi thành công",
        data: await ExamService.list(page, status, searchValue, topicIds),
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

  // async search(req: Request, res: Response) {
  //   const result: DefaultResponse<any> = await safeExecute(async () => {
  //     return {
  //       status: 200,
  //       message: "Lấy danh sách đề thi thành công",
  //       data: await ExamService.search(String(req.query.searchValue), Number(req.query.page)),
  //     };
  //   });

  //   return res.status(result.status).json(result);
  // },

  // async filter(req: Request, res: Response) {
  //   const result: DefaultResponse<any> = await safeExecute(async () => {
  //     const topicParam = req.query.topic;
  //     const status = String(req.query.status);
  //     const page = Number(req.query.page);

  //     let topicIds: number[] = [];

  //     if (typeof topicParam === "string" && topicParam.length > 0) {
  //       topicIds = topicParam.split(",").map(Number);
  //     }

  //     return {
  //       status: 200,
  //       message: "Lọc bài thi thành công",
  //       data: await ExamService.filter(topicIds, status, page)
  //     };
  //   })
  //   return res.status(result.status).json(result);
  // }
};

export default ExamController;
