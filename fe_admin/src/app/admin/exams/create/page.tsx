"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./ExamCreate.module.css";
import { useRouter } from "next/navigation";

type ExamSchedule = {
  exam_schedule_id: number;
  start_time: string;
  end_time: string;
};

type Topic = {
  topic_id: number;
  title: string;
  subject_id?: number;
};

type Subject = {
  subject_id: number;
  subject_name: string;
};

export default function ExamCreate() {
  const [name, setName] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [topicId, setTopicId] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [scheduleId, setScheduleId] = useState<number | null>(null);

  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
  const token = Cookies.get("token");

  //  Lấy dữ liệu khi component mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [scheduleRes, topicRes, subjectRes] = await Promise.all([
          fetch(`${API_URL}/exams/schedule`, { headers }),
          fetch(`${API_URL}/topics`, { headers }),
          fetch(`${API_URL}/subjects`, { headers }),
        ]);

        const scheduleData = await scheduleRes.json();
        const topicData = await topicRes.json();
        const subjectData = await subjectRes.json();

        setExamSchedules(scheduleData.data || []);
        setTopics(topicData.data || []);
        setSubjects(subjectData.data || []);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };

    fetchAll();
  }, [API_URL, token]);

  //  Submit form tạo bài thi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !timeLimit || !topicId || !subjectId || !scheduleId) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/exams/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          exam_name: name,
          time_limit: Number(timeLimit),
          topic_id: topicId,
          subject_id: subjectId,
          exam_schedule_id: scheduleId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Tạo bài thi thành công!");
      } else {
        alert(data.message || "Lỗi khi tạo bài thi!");
      }
      localStorage.setItem("exam_id", data.data.exam_id)
      router.push("/admin/exams/create/questions");
    } catch (error) {
      alert("Không thể tạo bài thi!");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tạo bài thi mới</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Tên bài thi */}
        <label className={styles.label}>Tên bài thi</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          placeholder="Nhập tên bài thi..."
        />

        {/* Thời gian */}
        <label className={styles.label}>Thời gian (phút)</label>
        <input
          type="number"
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
          className={styles.input}
          placeholder="VD: 60"
        />

        {/* Môn học */}
        <label className={styles.label}>Môn học</label>
        <select
          value={subjectId ?? ""}
          onChange={(e) => setSubjectId(Number(e.target.value))}
          className={styles.select}
        >
          <option value="">-- Chọn môn học --</option>
          {subjects.map((s) => (
            <option key={s.subject_id} value={s.subject_id}>
              {s.subject_name}
            </option>
          ))}
        </select>

        {/* Chủ đề */}
        <label className={styles.label}>Chủ đề</label>
        <select
          value={topicId ?? ""}
          onChange={(e) => setTopicId(Number(e.target.value))}
          className={styles.select}
        >
          <option value="">-- Chọn chủ đề --</option>
          {topics.map((t) => (
            <option key={t.topic_id} value={t.topic_id}>
              {t.title}
            </option>
          ))}
        </select>

        {/* Lịch thi */}
        <label className={styles.label}>Lịch thi</label>
        <select
          value={scheduleId ?? ""}
          onChange={(e) => setScheduleId(Number(e.target.value))}
          className={styles.select}
        >
          <option value="">-- Chọn lịch thi --</option>
          {examSchedules.map((s) => (
            <option key={s.exam_schedule_id} value={s.exam_schedule_id}>
              {new Date(s.start_time).toLocaleString("vi-VN")} →{" "}
              {new Date(s.end_time).toLocaleString("vi-VN")}
            </option>
          ))}
        </select>

        {/* Submit */}
        <button type="submit" className={styles.button}>
          Lưu bài thi
        </button>
      </form>
    </div>
  );
}
