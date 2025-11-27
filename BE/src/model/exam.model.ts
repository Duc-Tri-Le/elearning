import {Question} from "./question.model";

export interface Exam {
    exam_id: number;
    exam_name: string;
    create_at: Date;
    questions?: Question[];
    time_limit: number; // in minutes
    topic_id: number;
    exam_schedule_id: number;
}