"use client";
import styles from "./HistoryExam.module.css";

export default function ExamResults() {
  const results = [
    {
      testName: "New Economy TOEIC Test 10",
      date: "20/07/2025",
      score: "180/200",
      time: "01:16:12",
    },
  ];

  return (
    <section className={styles.results}>
      <table>
        <thead>
          <tr>
            <th>Bài thi</th>
            <th>Ngày làm</th>
            <th>Kết quả</th>
            <th>Thời gian làm bài</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.testName}</td>
              <td>{r.date}</td>
              <td>{r.score}</td>
              <td>{r.time}</td>
              <td>
                <button className={styles.link}>Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
