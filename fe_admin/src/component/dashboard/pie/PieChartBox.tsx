'use client';
import { useState } from 'react';
import { Doughnut } from 'react-chartjs-2'; // 👈 Đổi Pie → Doughnut
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import styles from './PieChartBox.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieProp {
  title: string;
  pieDataBySubject: { [key: string]: number[] | number };
  labels: string[];
}

export default function PieChartBox({ title, pieDataBySubject, labels }: PieProp) {
  const subjects = Object.keys(pieDataBySubject);
  const isMultiDataset = Array.isArray(pieDataBySubject[subjects[0]]);

  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);

  // Dữ liệu biểu đồ
  const chartData = isMultiDataset
    ? {
      labels,
      datasets: [
        {
          data: pieDataBySubject[selectedSubject] as number[],
          backgroundColor: ['#27ae60', '#3498db', '#f1c40f', '#e74c3c'],
          borderWidth: 3,        
          borderColor: '#fff',   
          borderRadius: 8,
        },
      ],
    }
    : {
      labels,
      datasets: [
        {
          data: subjects.map((s) => pieDataBySubject[s] as number),
          backgroundColor: ['#27ae60', '#3498db', '#f1c40f', '#e74c3c', '#9b59b6'],
          borderWidth: 3,        
          borderColor: '#fff',   
          borderRadius: 8,
        },
      ],
    };

  // Thêm phần options để có khoảng trống giữa (donut)
  const options = {
    cutout: '60%', // tạo khoảng trống giữa 60%
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className={styles.chartBox}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {isMultiDataset && (
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className={styles.select}
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Dùng Doughnut thay vì Pie và thêm options */}
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
