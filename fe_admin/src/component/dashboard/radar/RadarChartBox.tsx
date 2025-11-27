'use client';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import styles from "./RadarChartBox.module.css";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
    title: string;
    data: any;
}

export default function RadarChartBox({ title, data }: Props) {
    const options = {
        responsive: true,
        plugins: { legend: { position: 'bottom' as const } },
        scales: {
            r: {
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { display: false },
            },
        },
    };

    return (
        <div className={styles.chartBox}>
            <h3>{title}</h3>
            <Radar data={data} options={options} />
        </div>
    );
}
