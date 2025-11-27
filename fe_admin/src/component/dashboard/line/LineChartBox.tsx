"use client";

import styles from "./LineChartBox.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface TrafficChartProps {
  data: { date: string; value: number }[];
}

export default function LineChartBox({ data }: TrafficChartProps) {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>Lượng đăng ký trong 30 ngày</h3>
      <p className={styles.subtitle}>
        Biểu đồ thể hiện số lượng người đăng ký mỗi ngày trong 30 ngày gần nhất.
      </p>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ borderRadius: "8px", borderColor: "#ddd" }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
