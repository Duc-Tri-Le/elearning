import { Answer } from "./answer.model";

export interface Question {
  question_id: number;
  question_name: string;
  question_content: string;
  available: boolean;
  answers?: Answer[];
}
