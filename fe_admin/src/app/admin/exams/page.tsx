"use client";

import { useEffect, useState } from "react";
import styles from "./Exam.module.css";
import Cookies from "js-cookie";
import FilterExam from "@/component/filter/Filter/Filter";
import { useRouter } from "next/navigation";
import Search from "@/component/search/Search";
import Pagination from "@/component/pagination/Pagination";

type Exam = {
  exam_id: number;
  exam_name: string;
  created_at: string;
  time_limit: number;
  topic_id: number;
  exam_schedule_id: number;
  available: boolean;
  title: string
};

export default function Exam() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterExam, setFilterExam] = useState<Exam[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filterCondition, setFilterCondition] = useState<any>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const router = useRouter();

  //  Lấy danh sách bài thi
  useEffect(() => {
    const token = Cookies.get("token");
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;

    const fetchExam = async () => {
      let url = `${API_URL}/exams?page=${currentPage}`;

      //filter status
      if (filterCondition?.status) {
        url += `&status=${filterCondition.status}`
      }

      // Filter topics
      if (filterCondition?.topics && filterCondition.topics.length > 0) {
        url += `&topics=${filterCondition.topics.join(",")}`;
      }

      // Search
      if (searchKeyword.trim().length > 0) {
        url += `&search=${encodeURIComponent(searchKeyword)}`;
      }

      const resExam = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await resExam.json();

      setExams(data.data.exams);
      setTotalPages(data.data.totalPages);
      setLoading(false)
    };

    fetchExam();
  }, [currentPage, filterCondition, searchKeyword]);


  // Xoá bài thi
  const handleDelete = async (examId: number) => {
    try {
      const token = Cookies.get("token");
      await fetch(`${API_URL}/exams/remove/${examId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(exams.filter((e) => e.exam_id !== examId));
    } catch (err) {
      console.error(err);
    }
  };

  // Chuyển trạng thái hoạt động
  const handleToggleAvailable = async (examId: number, available: boolean) => {
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_URL}/exams/setAvailable/${examId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ available }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      setFilterExam((prev) =>
        prev
          .map((e) =>
            e.exam_id === examId ? { ...e, available } : e
          )
          .filter((e) => {
            const topicMatch = filterCondition?.topics.includes(e.topic_id);
            const statusMatch =
              filterCondition?.status === "All" || filterCondition?.status === e.available.toString();
            return topicMatch && statusMatch;
          })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const detailExam = (id: number, exam: Exam) => {
    localStorage.setItem("exam", JSON.stringify(exam));
    router.push(`/admin/exams/detail/${id}`)
  };

  if (loading) return <p className={styles.loading}>Đang tải danh sách bài thi...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý bài thi</h1>
        <div className={styles.actions}>
          <div className={styles.button} onClick={() => router.push("/admin/exams/create")}><button className={styles.addButton}>+ Thêm bài thi</button></div>
          {/* filter search */}
          <div className={styles.filter_search}>
            <FilterExam setFilterCondition={setFilterCondition} setSearchKeyword={setSearchKeyword} />
            <Search setFilterExam={setFilterExam} currentPage={currentPage} setTotalPage={setTotalPages} />
          </div>
        </div>
      </div>
      {/* noi hien  bang*/}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên bài thi</th>
            <th>Thời gian (phút)</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Chủ đề</th>
            <th>Xoá</th>
          </tr>
        </thead>
        <tbody>
          {exams?.length > 0 ? (
            exams?.map((exam, index) => (
              <tr key={exam.exam_id} onClick={() => detailExam(exam.exam_id, exam)}>
                <td>{index + 1}</td>
                <td>{exam.exam_name}</td>
                <td>{exam.time_limit}</td>
                <td>{new Date(exam.created_at).toLocaleDateString("vi-VN")}</td>
                <td
                  className={exam.available ? styles.active : styles.inactive}
                >
                  {exam.available ? "Hoạt động" : "Không hoạt động"}
                  <span
                    className={styles.editIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleAvailable(exam.exam_id, !exam.available)
                    }
                    }
                  >
                    ✎
                  </span>
                </td>
                <td>{exam.title}</td>
                <td>
                  <button
                    className={styles.delBtn}
                    onClick={() => handleDelete(exam.exam_id)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className={styles.empty}>
                Không có bài thi phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* pagination */}
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}
