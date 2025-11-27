import DocumentService from "../services/document.service";
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import { Request, Response } from "express";

const DocumentController = {
  async getAll(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 200,
        message: "Lấy danh sách tài liệu thành công",
        data: await DocumentService.getAll(Number(req.query.page)),
      };
    });

    return res.status(result.status).json(result);
  },

  async create(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {
      if (!req.file) throw new Error("Không có file được tải lên");

      const file = req.file
      const filePath = req.file.path;
      const fileLink = `${process.env.BACKEND_URL}/resources/docx_file/${req.file.filename}`;
      const document = await DocumentService.create(req.body, fileLink);

      return {
        status: 200,
        message: "Tải tài liệu thành công",
        data: document,
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

  async search(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 200,
        message: "Lấy danh sách tài liệu thành công",
        data: await DocumentService.search(String(req.query.searchValue), Number(req.query.page)),
      };
    });

    return res.status(result.status).json(result);
  },

  async filter(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {
      const topicParam = req.query.topic;
      const status = String(req.query.status);
      const page = Number(req.query.page);

      let topicIds: number[] = [];

      if (typeof topicParam === "string" && topicParam.length > 0) {
        topicIds = topicParam.split(",").map(Number);
      }

      return {
        status: 200,
        message: "Lọc tài liệu thành công",
        data: await DocumentService.filter(topicIds, status, page)
      };
    });

    return res.status(result.status).json(result);
  },
};

export default DocumentController;
