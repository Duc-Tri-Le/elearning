import { Request, Response } from 'express';
import QuestionService from '../services/question.service';
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import path from "path";
import fs from "fs";
import {parseQuestionsFromCSV} from '../utils/parse.csv';
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const QuestionController = {
  // async get(req: Request, res: Response) {
  //   const questions = await QuestionService.get();
  //   res.json(questions);
  // },

  async getAll(req: Request, res: Response) {
    const response: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 200,
        message: "Lấy danh sách câu hỏi thành công",
        data: await QuestionService.getAll(Number(req.query.page))
      } as DefaultResponse<any>;
    });

    res.status(response.status).json(response);
  },

  async create(req: Request, res: Response) {
    const response: DefaultResponse<any> = await safeExecute(async () => {
      const { questions } = req.body;

      const created = await QuestionService.create(questions);

      return {
        status: 201,
        message: "Tạo câu hỏi thành công",
        data: created
      } as DefaultResponse<any>;
    });

    res.status(response.status).json(response);
  },

    async createByCsv(req: Request, res: Response) {
    const response: DefaultResponse<any> = await safeExecute(async () => {
      const { filename } = req.params;
      const csvDir = path.join(process.cwd(), "data/final");
      const filePath = path.join(csvDir, filename);
      
      if (!fs.existsSync(csvDir)) {
          fs.mkdirSync(csvDir, { recursive: true });
      }

      const questions = await parseQuestionsFromCSV(filePath);
      
      const created = await QuestionService.create(questions);

      return {
        status: 201,
        message: "Tạo câu hỏi thành công",
        data: created
      } as DefaultResponse<any>;
    });

    res.status(response.status).json(response);
  },

  async update(req: Request, res: Response) {
    const response: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 202,
        message: "Cập nhật câu hỏi thành công",
        data: await QuestionService.update(Number(req.params.id), req.body)
      } as DefaultResponse<any>;
    });

    res.status(response.status).json(response);
  },

  async setAvailable(req: Request, res: Response) {
    console.log(req.body);
    const response: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 202,
        message: "Đổi trạng thái câu hỏi thành công",
        data: await QuestionService.setAvailable(parseInt(req.params.id, 10), Boolean(req.body.available))
      } as DefaultResponse<any>;
    });

    res.status(response.status).json(response);
  },

  async remove(req: Request, res: Response) {
    const response: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 204,
        message: "Xoá câu hỏi thành công",
        data: await QuestionService.remove(parseInt(req.params.id, 10))
      } as DefaultResponse<any>;
    });

    res.status(response.status).json(response);
  },

  async searchQuestions(req: Request, res: Response) {
    const result: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 200,
        message: "Lấy danh sách câu hỏi thành công",
        data: await QuestionService.searchQuestions(
          String(req.query.searchValue),
          Number(req.query.page)
        ),
      };
    });

    return res.status(result.status).json(result);
  },

  async filterQuestion(req: Request, res: Response){
    const result : DefaultResponse<any> = await safeExecute(async () => {
      return {
        status : 200,
        message: "Lấy danh sách câu hỏi thành công",
        data: await QuestionService.filterQuestions(
          String(req.query?.question_name),
          String(req.query?.source),
          String(req.query?.status),
          Number(req.query.page)
        ),
      }
    })

    return res.status(result.status).json(result);
  }
};

export default QuestionController;