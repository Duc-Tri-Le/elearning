import { Question } from "./question.model";

export interface Bank {
    bank_id: number;
    description: string;
    topic_id: number;
    questions?: Question[];
    available: boolean;
}