"use client";
import { useState } from "react";
import styles from "./Table.module.css";

type UserStats = {
  date: string;
  activeUsers: number;
  userRatio: number;
  avgSession: number;
  medianSession: number;
};

type StatsProp = {
  userStats:  UserStats[];
};

export default function UserStatsTable({ userStats }: StatsProp) {
  const [selectedPeriod, setSelectedPeriod] = useState("Đợt 3");

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ngày</th>
            <th>Số active user</th>
            <th>Tỉ trọng user</th>
            <th>Trung bình thời gian một session (phút)</th>
            <th>Trung vị thời gian một session (phút)</th>
          </tr>
        </thead>
        <tbody>
          {userStats.map((row, index) => (
            <tr key={index}>
              <td>{row.date}</td>
              <td>{row.activeUsers}</td>
              <td>{(row.userRatio * 100).toFixed(2)}%</td>
              <td>{row.avgSession.toFixed(2)}</td>
              <td>{row.medianSession.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
