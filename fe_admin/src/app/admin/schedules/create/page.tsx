"use client";

import Cookies from "js-cookie";
import { useState } from "react";
import styles from "./Exam.Schedule.Create.module.css"; 

type ExamSchedule = {
  start_time: string;
  end_time: string;
};

export default function ExamScheduleCreate() {
  const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
  const token = Cookies.get("token");

  const [form, setForm] = useState<ExamSchedule>({
    start_time: "",
    end_time: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddExamSchedule = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/exams/schedule/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Thêm lịch thi thất bại");
      alert("Thêm lịch thi thành công");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.form_container}>
      <h2 className={styles.form_title}>Tạo lịch thi</h2>

      <div className={styles.form_body}>
        <div className={styles.field}>
          <label className={styles.label}>Thời gian bắt đầu</label>
          <input
            type="datetime-local"
            name="start_time"
            className={styles.input}
            value={form.start_time}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Thời gian kết thúc</label>
          <input
            type="datetime-local"
            name="end_time"
            className={styles.input}
            value={form.end_time}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleAddExamSchedule}
          className={`${styles.btn} ${styles.btn_primary}`}
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Tạo lịch thi"}
        </button>
      </div>
    </div>
  );
}
