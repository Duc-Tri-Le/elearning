"use client";

import { useState } from "react";
import styles from "./FilterSchdedules.module.css";


type ExamSchedule = {
    exam_schedule_id: number;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
};

interface FilterScheduleProps {
    examSchedules: ExamSchedule[];
    setFilteredSchedules: React.Dispatch<React.SetStateAction<ExamSchedule[]>>;
}

export default function FilterSchedule({
    examSchedules,
    setFilteredSchedules,
}: FilterScheduleProps) {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const handleFilter = () => {
        if (!startDate && !endDate) {
            setFilteredSchedules(examSchedules);
            return;
        }

        const start = startDate ? new Date(`${startDate}T00:00:00Z`).getTime() : 0;
        const end = endDate ? new Date(`${endDate}T23:59:59Z`).getTime() : Infinity;

        const filtered = examSchedules.filter((item) => {
            const examStart = new Date(item.start_time).getTime();
            return examStart >= start && examStart <= end;
        });

        setFilteredSchedules(filtered);
    };

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        setFilteredSchedules(examSchedules);
    };

    return (
        <div className={styles.filter_container}>
            <h3 className={styles.filter_title}>Lọc theo thời gian</h3>

            <div className={styles.filter_fields}>
                <div className={styles.field}>
                    <label className={styles.label}>Từ ngày</label>
                    <input
                        type="date"
                        className={styles.input}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Đến ngày</label>
                    <input
                        type="date"
                        className={styles.input}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <div className={styles.actions}>
                    <button onClick={handleFilter} className={styles.btn_primary}>
                        Lọc
                    </button>
                    <button onClick={handleReset} className={styles.btn_secondary}>
                        Đặt lại
                    </button>
                </div>
            </div>
        </div>
    );
}
