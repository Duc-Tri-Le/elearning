"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./DocumentCreate.module.css";
import { useRouter } from "next/navigation";

type Topic = {
  topic_id: number;
  title: string;
  subject_id?: number;
};

type Subject = {
  subject_id: number;
  subject_name: string;
};

export default function DocumentCreate() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [topicId, setTopicId] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filterTopic, setFilterTopic] = useState<Topic[]>([]);
  const embedding = "";
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
  const token = Cookies.get("token");

  //  Lấy dữ liệu topic và subject
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const [topicRes, subjectRes] = await Promise.all([
          fetch(`${API_URL}/topics`, { headers }),
          fetch(`${API_URL}/subjects`, { headers }),
        ]);

        const topicData = await topicRes.json();
        const subjectData = await subjectRes.json();

        setTopics(topicData.data || []);
        setSubjects(subjectData.data || []);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };

    fetchAll();
  }, [API_URL, token]);

  //  Lọc chủ đề theo môn học
  useEffect(() => {
    setFilterTopic(topics.filter((t) => t.subject_id === subjectId));
  }, [subjectId, topics]);

  //  Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !file || !topicId || !subjectId) {
      alert("Vui lòng điền đầy đủ thông tin và chọn file!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("topic_id", topicId.toString());
      formData.append("file", file);

      const res = await fetch(`${API_URL}/documents/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Tải tài liệu thành công!");
        router.push("/admin/documents");
      } else {
        alert(data.message || "Lỗi khi tải tài liệu!");
      }
    } catch (error) {
      console.error(error);
      alert("Không thể tải tài liệu!");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Thêm tài liệu mới</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Tên tài liệu */}
        <label className={styles.label}>Tên tài liệu</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          placeholder="Nhập tên tài liệu..."
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
          {filterTopic.map((t) => (
            <option key={t.topic_id} value={t.topic_id}>
              {t.title}
            </option>
          ))}
        </select>

        {/* Upload file */}
        <label className={styles.label}>Chọn file tài liệu (.docx, .pdf...)</label>
        <input
          type="file"
          accept=".doc,.docx,.pdf"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className={styles.inputFile}
        />

        {/* Submit */}
        <button type="submit" className={styles.button}>
          Lưu tài liệu
        </button>
      </form>
    </div>
  );
}
