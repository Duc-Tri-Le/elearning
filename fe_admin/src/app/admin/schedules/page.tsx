"use client";
import { useEffect, useState } from "react";
import styles from "./Schedule.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import FilterSchedule from "@/component/filter/FilterSchedules/FilterSchedules";

// Định nghĩa type cho mỗi lịch thi
type ExamSchedule = {
  exam_schedule_id: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
};

export default function Schedule() {
  const [filterSchedules, setFilterSchedules] = useState<ExamSchedule[]>([]);
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([]);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;

  //lấy lịch thi
  useEffect(() => {
    const token = Cookies.get("token");
    const fetchdSchedule = async () => {
      const resExamSchedule = await fetch(`${API_URL}/exams/schedule`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      })
      const data = await resExamSchedule.json();
      setExamSchedules(data.data)
    }
    fetchdSchedule();
  }, [])

  useEffect(() => {
    setFilterSchedules(examSchedules)
  }, [examSchedules])

  const detailExamSchedule = (id : number) => {
    router.push(`/admin/schedules/detail/${id}`)
  }

  const renderTable = (data: ExamSchedule[]) => (
    <table className={styles.schedule_table}>
      <thead>
        <tr>
          <th>STT</th>
          <th>Bắt đầu</th>
          <th>Kết thúc</th>
          <th>Ngày tạo</th>
          <th>Ngày cập nhật</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={item.exam_schedule_id} onClick={() => detailExamSchedule(item.exam_schedule_id)}>
            <td>{index + 1}</td>

            <td>{new Date(item.start_time).toLocaleString("vi-VN")}</td>
            <td>{new Date(item.end_time).toLocaleString("vi-VN")}</td>

            <td>{new Date(item.created_at).toLocaleString("vi-VN")}</td>
            <td>{new Date(item.updated_at).toLocaleString("vi-VN")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={styles.schedule_container}>
      <div className={styles.schedule_header}>
        <h1 className={styles.schedule_title}>Quản lý lịch thi</h1>
        <div className={styles.schedule_action}>
          <button className={styles.schedule_button} onClick={() => router.push("/admin/schedules/create")}>
            Thêm lịch thi
          </button>
          <FilterSchedule examSchedules={examSchedules} setFilteredSchedules={setFilterSchedules}/>
        </div>
      </div>
      {/* Hiển thị bảng */}
      {renderTable(filterSchedules)}
    </div>
  );
}
