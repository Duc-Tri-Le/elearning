"use client";
import React, { useEffect, useState } from "react";
import styles from "./ExamList.module.css";
import { useRouter } from "next/navigation";
import Topic from "@/components/filter/Filter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setExams } from "@/store/slices/examSlice";
import Cookies from "js-cookie";
import Pagination from "@/components/pagination/Pagination";

type Exam = {
  exam_id: number;
  exam_name: string;
  created_at: string;
  time_limit: number;
  topic_id: number;
  exam_schedule_id? : number;
  start_time : string;
  end_time : string
};

export default function ExamList() {
  const [filterExam, setFilterExam] = useState<Exam[]>([])
  const router = useRouter();
  const exams = useSelector((state: RootState) => state.exam.exams);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    const token = Cookies.get("token");
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const fetchExam = async () => {
      const resExam = await fetch(`${API_URL}/exams?page=${currentPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      const data = await resExam.json();
      dispatch(setExams(data.data.data));
      setTotalPage(data.data.totalPage);
    }
    fetchExam();
    // dispatch(
    //   setExams(mockExams)
    // )
  }, []);

  useEffect(() => {
    setFilterExam(exams)
  }, [exams])

  const handleDoExam = (exam_id: number, exam : Exam) => {
    localStorage.setItem("exam", JSON.stringify(exam))
    router.push(`/exam/${exam_id}/do`)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}> Danh sách đề thi thử</h1>

      {/* Thanh chọn topic */}
      <Topic exams={exams} setFilterExam={setFilterExam} />

      {/* Danh sách đề thi */}
      <div className={styles.grid}>
        {filterExam.map((exam, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.header}>
              <h2 className={styles.examName}>{exam.exam_name}</h2>
            </div>
            <p className={styles.date}>
              <span>📅 Bắt đầu: {new Date(exam.start_time).toLocaleString("vi-VN")}</span>
              <span>📅 Kết thúc: {new Date(exam.end_time).toLocaleString("vi-VN")}</span>
            </p>
            <p className={styles.time}>⏱ Thời gian làm bài: {exam.time_limit} phút</p>
            <button onClick={() => handleDoExam(exam.exam_id, exam)} className={styles.button}>Bắt đầu thi</button>
          </div>
        ))}
      </div>

      {filterExam.length === 0 ? (
          <p className={styles.empty}>Không có đề thi cho chủ đề này.</p>
        ) : (
          <Pagination totalPages={totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        )}
    </div>
  );
}
