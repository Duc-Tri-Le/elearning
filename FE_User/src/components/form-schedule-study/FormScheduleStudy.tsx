"use client";

import styles from "./FormScheduleStudy.module.css";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface StudyScheduleForm {
    schedule_study_id?: number;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    status?: "pending" | "in_progress" | "completed";
    target_question: number;
    subject_id?: number;
}

interface StudySchedule {
    study_schedule_id: number;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    status?: string;
    target_question: number;
    subject_id: number;
    subject_name: string
}

interface Subject {
    subject_id: number;
    subject_name: string;
}

interface FormScheduleProps {
    form: StudyScheduleForm;
    setIsAdd?: React.Dispatch<React.SetStateAction<boolean>>;
    isAdd?: boolean;
    setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>;
    isEdit?: boolean;
    setForm: React.Dispatch<React.SetStateAction<StudyScheduleForm>>;
    setError?: React.Dispatch<React.SetStateAction<string>>;
    error?: string;
    loading?: boolean;
    setSchedules: React.Dispatch<React.SetStateAction<StudySchedule[]>>;
}

export default function FormScheduleStudy({
    form,
    setIsAdd,
    isAdd,
    setIsEdit,
    isEdit,
    setForm,
    error,
    setError,
    loading,
    setSchedules
}: FormScheduleProps) {

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const API_ARL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "target_question") {
            const numericOnly = value;

            if (numericOnly !== value.replace(/[^0-9]/g, "")) {
                setForm(prev => ({ ...prev, target_question: "" as any }));
                setError?.("Không được để là chữ")
                return;
            }

            if (numericOnly === "") {
                setForm(prev => ({ ...prev, target_question: "" as any }));
                setError?.("Số câu hỏi mục tiêu không được để trống.")
                return;
            }

            const num = Number(numericOnly);

            if (num === 0) {
                setForm(prev => ({ ...prev, target_question: num }));
                setError?.("Số câu hỏi phải lớn hơn 0.");
                return;
            }

            if (num > 10000) {
                setForm(prev => ({ ...prev, target_question: num }));
                setError?.("Số câu hỏi không được vượt quá 10.000.");
                return;
            }

            setError?.("");
            setForm(prev => ({ ...prev, target_question: num }));
            return;
        }

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchSubject = async () => {
            const res = await fetch(`${API_ARL}/subjects`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json();
            setSubjects(data.data)
        }
        fetchSubject();
    }, [])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`${API_ARL}/schedule/study/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form)
        })
        const schedule = await res.json();

        setSchedules(prev => [...prev, schedule.data]);
        setIsAdd?.(false)
    };

    const handleSave = async (schedule_study_id?: number) => {
        const res = await fetch(`${API_ARL}/schedule/study/update/${schedule_study_id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        })
        const schedule = await res.json();
        setSchedules(prev =>
            prev.map(p =>
                p.study_schedule_id === schedule.schedule_study_id
                    ? schedule
                    : p
            )
        );
        setIsEdit?.(false)
    };


    function toLocalDatetimeValue(isoString: string) {
        if (!isoString) return ""; // tránh lỗi NaN

        const date = new Date(isoString);
        if (isNaN(date.getTime())) return ""; 

        // Lấy local datetime (UTC+7 của Việt Nam)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleRemove = async (schedule_study_id?: number) => {
        const res = await fetch(`${API_ARL}/schedule/study/remove/${schedule_study_id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        setSchedules(prev =>
            prev.filter(p =>
                p.study_schedule_id !== schedule_study_id
            )
        )
        setIsEdit?.(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.head}>
                <h2>Tạo lịch học mới</h2>
                <div className={styles.button}
                    onClick={() => {
                        if (isAdd) setIsAdd?.(false)
                        if (isEdit) setIsEdit?.(false)
                    }}>
                    X
                </div>
            </div>

            <form className={styles.form}>
                <label className={styles.label}>
                    Tiêu đề
                    <input
                        className={styles.input}
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className={styles.label}>
                    Mô tả
                    <textarea
                        className={styles.textarea}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </label>

                <label className={styles.label}>
                    Thời gian bắt đầu
                    <input
                        className={styles.input}
                        type="datetime-local"
                        name="start_time"
                        value={toLocalDatetimeValue(form.start_time)}
                        onChange={handleChange}
                    />
                </label>

                <label className={styles.label}>
                    Thời gian kết thúc
                    <input
                        className={styles.input}
                        type="datetime-local"
                        name="end_time"
                        value={toLocalDatetimeValue(form.end_time)}
                        onChange={handleChange}
                    />
                </label>

                <label className={styles.label}>
                    Số câu hỏi mục tiêu
                    <input
                        className={styles.input}
                        name="target_question"
                        value={form.target_question}
                        onChange={handleChange}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                </label>

                <label className={styles.label}>
                    Môn học
                    <select
                        value={form.subject_id ? form.subject_id : ""}
                        onChange={(e) => handleChange(e)}
                        className={styles.select}
                        name="subject_id"
                    >
                        <option value="">-- Chọn môn học --</option>
                        {subjects.map((s) => (
                            <option key={s.subject_id} value={s.subject_id}>
                                {s.subject_name}
                            </option>
                        ))}
                    </select>
                </label>

                {isAdd &&
                    <Button onClick={(e) => handleAdd(e)} disabled={loading}>
                        {loading ? "Đang tạo..." : "Tạo lịch học"}
                    </Button>}

                {isEdit &&
                    <div className={styles.button_edit}>
                        <Button type="button" onClick={() => handleSave(form.schedule_study_id)}>
                            Lưu
                        </Button>
                        <Button type="button" onClick={() => handleRemove(form.schedule_study_id)}>
                            Xoá
                        </Button>
                    </div>
                }
            </form>
        </div>
    );
}
