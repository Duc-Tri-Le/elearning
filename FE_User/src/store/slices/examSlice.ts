"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Exam = {
  exam_id: number;
  exam_name: string;
  time_limit: number;
  created_at: string;
  topic_id : number;
  start_time : string;
  end_time : string
};

type ExamState = {
  exams: Exam[];
};

const initialState: ExamState = {
  exams: [],
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    // Lưu (ghi đè) toàn bộ danh sách
    setExams: (state, action: PayloadAction<Exam[]>) => {
      state.exams = action.payload;
    },

    // Thêm một exam mới vào danh sách
    addExam: (state, action: PayloadAction<Exam>) => {
      state.exams.push(action.payload);
    },

    // Xoá toàn bộ exam
    clearExams: (state) => {
      state.exams = [];
    },
  },
});

export const { setExams, addExam, clearExams } = examSlice.actions;
export const examReducer = examSlice.reducer;
