'use client';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styles from "./BarChartBox.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

interface Props {
    title: string;
    datasets: any;
}

export default function BarChartBox({ title, datasets }: Props) {
    const options = {
        responsive: true,
        plugins: {
            legend: { display : false},
            title: { display: false },
            datalabels: {
                anchor: 'end' as const,
                align: 'end' as const,
                formatter: (value: any) => `${value}`,
                color: '#000',
                font: { weight: 10 }
            }
        },
        scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true }
        }
    };

    // Tạo dữ liệu với màu sắc riêng cho từng dataset
    const dataWithColors = {
        ...datasets,
        datasets: datasets.datasets.map((ds: any) => ({
            ...ds,
            backgroundColor: ds.backgroundColor || 'rgba(54, 162, 235, 0.6)', // màu fill bar
            borderColor: ds.borderColor || 'rgba(54, 162, 235, 1)', // màu viền bar
            borderWidth: 1
        }))
    };

    return (
        <div className={styles.chartBox}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
            </div>
            <Bar data={dataWithColors} options={options} plugins={[ChartDataLabels]} />
        </div>
    );
}
