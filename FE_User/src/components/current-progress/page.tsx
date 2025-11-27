"use client";
import { useEffect, useState } from "react";
import styles from "./CurrentProgress.module.css";
import Cookies from "js-cookie";

interface Goal {
    user_goal_id: number;
    target_score: number;
    deadline: string;
    subject_name: string;
    current_progress: number;
}

type currentProp = {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CurrentProgress({ setIsOpen }: currentProp) {
    const [goals, setGoals] = useState<Goal[]>([]);
    const API = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");

    const fetchGoals = async () => {
        const res = await fetch(`${API}/goal`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        setGoals(data.data || []);
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleClose = () => {
        setIsOpen(false)
    }

    if (goals.length === 0) return <p className={styles.noData}>Chưa có tiến độ!</p>;

    return (
        <>
            <div className={styles.header}>
                <h3 className={styles.title}>Tiến độ hiện tại</h3>
                <span className={styles.arrow} onClick={handleClose}>&gt;</span>
            </div>
            {goals.map((goal) => (
                <div key={goal.user_goal_id} className={styles.goalItem}>
                    <div className={styles.goalHeader}>
                        <span className={styles.subjectName}>{goal.subject_name}</span>
                        <span className={styles.percent}>{goal.current_progress}%</span>
                    </div>
                    <div className={styles.progressBox}>
                        <div
                            className={styles.bar}
                            style={{ width: `${goal.current_progress}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </>
    );
}
