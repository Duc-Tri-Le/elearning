"use client";

import { useEffect, useState } from "react";
import styles from "./ScheduleStudy.module.css";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import AddScheduleStudy from "@/components/add-schedule-study/AddScheduleStudy";
import FormScheduleStudy from "@/components/form-schedule-study/FormScheduleStudy";

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

interface StatusProp {
    name: string,
    value: string
}

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

export default function ScheduleStudy() {
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");
    const [schedules, setSchedules] = useState<StudySchedule[]>([]);
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("pending");
    const [selectSchedule, setSelectSchedule] = useState<({ schedule_study_id: number }[])>([]);
    const [isEdit, setIsEdit] = useState(false);

    const [editForm, setEditForm] = useState<StudyScheduleForm>({
        schedule_study_id: undefined,
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        status: "pending",
        target_question: 0,
        subject_id: undefined
    });

    const status: StatusProp[] = [
        { name: "Đang chờ", value: "pending" },
        { name: "Đã hoàn thành", value: "done" },
        { name: "Bỏ lỡ", value: "miss" }
    ]

    const fetchSchedules = async () => {
        try {
            const res = await fetch(`${API_URL}/schedule/study`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const scheduleStudy = await res.json();
            setSchedules(scheduleStudy.data.schedule);
        } catch (err) {
            console.error("Lỗi khi lấy lịch học:", err);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleFilter = async (newStatus: string) => {
        try {
            const res = await fetch(`${API_URL}/schedule/study/filter?status=${newStatus}`, {
                method: "GET",
                headers: {
                    "Content-Type": "appication/json",
                    Authorization: `Bearer ${token}`
                }
            })
            const scheduleStudy = await res.json();
            setSchedules(scheduleStudy.data.schedule);
        } catch (error) {
            console.log("error: ", error);
        }
    };

    function formatVN(dateStr: string) {
        const [datePart, timePart] = dateStr.split("T");
        const time = timePart ? timePart.slice(0, 5) : "00:00";
        const [year, month, day] = datePart.split("-");
        return `${day}/${month}/${year} ${time}`;
    };

    const handleEdit = (schedule: StudySchedule) => {
        setEditForm({
            schedule_study_id: schedule.study_schedule_id,
            title: schedule.title,
            description: schedule.description,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            status: schedule.status as "pending" | "in_progress" | "completed",
            target_question: schedule.target_question,
            subject_id: schedule.subject_id
        });
        setIsEdit(true);
    };

    const handleSelectSchedule = async (schedule_study_id: number) => {
        setSelectSchedule(prev => {
            const exits = selectSchedule.some((x) => x.schedule_study_id === schedule_study_id);
            if (exits) return prev.filter((x) => x.schedule_study_id !== schedule_study_id)
            return [...prev, { schedule_study_id: schedule_study_id }]
        })
        setSchedules(prev => {
            return prev.filter((x) => (
                x.study_schedule_id !== schedule_study_id
                && !selectSchedule.some(s => s.schedule_study_id === x.study_schedule_id)
            ))
        });

        const res = await fetch(`${API_URL}/schedule/study/update/${schedule_study_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: "done" })
        })
    }
    
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Danh sách lịch học</h1>

            {/* them lich hoc va tim kiem*/}
            <div className={styles.add_search}>
                <div className={styles.btn_add}>
                    <Button onClick={() => setIsAdd(true)}>Tạo lịch học</Button>
                </div>
            </div>

            {/* loc */}
            <div className={styles.filter}>
                <div className={styles.filter_status}>
                    {status.map((st, index) => (
                        <div
                            key={index}
                            className={`${styles.filter_status_s} ${selectedStatus === st.value ? styles.active : ""
                                }`}
                            onClick={async () => {
                                const newStatus: string = st.value;
                                setSelectedStatus(newStatus);

                                await handleFilter( newStatus);
                            }}

                        >
                            {st.name}
                        </div>

                    ))}
                </div>
            </div>

            {/* them sua */}
            {isAdd && <div className={styles.overlay}>
                <div className={styles.csvModal}>
                    <div className={styles.csvHeader}>
                        <AddScheduleStudy isAdd={isAdd} setIsAdd={setIsAdd} setSchedules={setSchedules}/>
                    </div>
                </div>
            </div>}

            {isEdit &&
                <div className={styles.overlay}>
                    <div className={styles.csvModal}>
                        <div className={styles.csvHeader}>
                            <FormScheduleStudy
                                form={editForm}
                                setForm={setEditForm}
                                setIsEdit={setIsEdit}
                                isEdit={isEdit}
                                setSchedules={setSchedules}
                                 />
                        </div>
                    </div>
                </div>
            }

            <ul className={styles.list}>
                {schedules?.map((s) => (
                    <li key={s.study_schedule_id} className={styles.item}>
                        <div className={styles.card_header}>
                            <div className={styles.card_header_left}>
                                <h3 className={styles.card_title}>{s.title}</h3>
                                {s.status === "pending" && <span className={styles.edit_icon} onClick={() => handleEdit(s)}>
                                    ✏️
                                </span>}
                            </div>
                            {s.status === "pending" && <div className={styles.card_header_right}>
                                <input
                                    type="checkbox"
                                    checked={selectSchedule.some(item => item.schedule_study_id === s.study_schedule_id)}
                                    onChange={() => handleSelectSchedule(s.study_schedule_id)}
                                />
                            </div>}
                        </div>
                        <p className={styles.card_subject_name}>Môn học: {s.subject_name}</p>
                        <p className={styles.card_description}>{s.description}</p>
                        <p className={styles.card_date}>
                            <span>📅 Bắt đầu: {formatVN(s.start_time)}</span>
                            <span>📅 Kết thúc: {formatVN(s.end_time)}</span>
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
