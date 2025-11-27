"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./UserGoal.module.css";
import { Button } from "@/components/ui/button";
import ProfilePage from "@/components/profile/page";

interface Goal {
    user_goal_id: number;
    target_score: number;
    deadline: string;
    subject_name: string;
    current_progress: number;
}

interface Subject {
    subject_id: number;
    subject_name: string;
}

export default function UserGoal() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [error, setError] = useState<string>("");
    const [form, setForm] = useState({
        target_score: "",
        deadline: "",
        subject_id: ""
    });

    const API = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "target_score") {
            let numericOnly = value.replace(/[^0-9.]/g, "");

            // Không cho nhập 2 dấu chấm
            if ((numericOnly.match(/\./g) || []).length > 1) {
                setError("Chỉ được phép nhập một dấu thập phân.");
                return;
            }

            if (numericOnly === "") {
                setForm(prev => ({ ...prev, target_score: "" }));
                setError("Số điểm mục tiêu không được để trống.");
                return;
            }

            const num = Number(numericOnly);

            if (isNaN(num)) {
                setError("Điểm phải là số.");
                return;
            }

            if (num > 10) {
                setError("Số điểm không được vượt quá 10.");
                return;
            }

            setError("");
            setForm(prev => ({ ...prev, target_score: numericOnly }));
            return;
        }

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.target_score || !form.deadline || !form.subject_id) {
            alert("Vui lòng nhập đầy đủ!");
            return;
        }

        await fetch(`${API}/goal/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ form })
        });

        setForm({
            target_score: "",
            deadline: "",
            subject_id: ""
        });

        fetchGoals();
    };

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

    const fetchSubjects = async () => {
        const res = await fetch(`${API}/subjects`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSubjects(data.data || []);
    };

    useEffect(() => {
        fetchGoals();
        fetchSubjects();
    }, []);

    const formatDate = (str: string) => {
        return new Date(str).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    return (
        <ProfilePage>
            <div className={styles.goal_container}>

                <form onSubmit={handleCreate} className={styles.goal_form}>
                    <label className={styles.label}>
                        Điểm mục tiêu
                        <input
                            className={styles.input}
                            name="target_score"
                            type="text"
                            inputMode="decimal"
                            value={form.target_score}
                            onChange={handleChange}
                        />
                        {error && <p className={styles.error}>{error}</p>}
                    </label>

                    <label className={styles.label}>
                        Thời hạn
                        <input
                            className={styles.input}
                            name="deadline"
                            type="datetime-local"
                            value={form.deadline}
                            onChange={handleChange}
                        />
                    </label>

                    <label className={styles.label}>
                        Môn học
                        <select
                            className={styles.select}
                            name="subject_id"
                            value={form.subject_id}
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn môn --</option>
                            {subjects.map(s => (
                                <option key={s.subject_id} value={s.subject_id}>
                                    {s.subject_name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className={styles.btn}>
                        <Button>
                            Tạo mục tiêu
                        </Button>
                    </div>
                </form>

                <div className={styles.list_goal}>
                    <h3 className={styles.list_title}>Danh sách mục tiêu</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Mục tiêu điểm số</th>
                                <th>Thời hạn</th>
                                <th>Môn học</th>
                                <th>Tiến trình hiện tại</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goals.map((g, i) => (
                                <tr key={i}>
                                    <td>{g.target_score}</td>
                                    <td>{formatDate(g.deadline)}</td>
                                    <td>{g.subject_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </ProfilePage>
    );
}
