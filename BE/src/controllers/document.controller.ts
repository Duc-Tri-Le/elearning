import DocumentService from "../services/document.service";
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import { Request, Response } from "express";

const DocumentController = {
  async getAll(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 200,
        message: "Lấy danh sách tài liệu thành công",
        data: await DocumentService.getAll(),
      };
    });

    return res.status(result.status).json(result);
  },

  async create(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 201,
        message: "Tạo tài liệu thành công",
        data: await DocumentService.create(req.body),
      };
    });

    return res.status(result.status).json(result);
  },

  async update(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 202,
        message: "Cập nhật tài liệu thành công",
        data: await DocumentService.update(Number(req.params.id), req.body),
      };
    });

    return res.status(result.status).json(result);
  },

  async setAvailable(req: Request, res: Response) {

    const result: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 202,
        message: "Đổi trạng thái tài liệu thành công",
        data: await DocumentService.setAvailable(
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
        message: "Xoá tài liệu thành công",
        data: await DocumentService.remove(Number(req.params.id)),
      };
    });

    return res.status(result.status).json(result);
  },
};

export default DocumentController;
