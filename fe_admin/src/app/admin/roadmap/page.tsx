"use client";
import { useEffect, useState } from "react";
import styles from "./Roadmap.module.css";
import Cookies from "js-cookie";
import { Button } from "@/component/ui/button/Button";

interface RoadmapStep {
    roadmap_step_id: number;
    title: string;
    description: string;
    topic_id: number;
}

interface Topic {
    topic_id: number;
    title: string;
    description?: string;
    subject_id?: number | null;
    created_at: string;
}

export default function RoadmapEditor() {
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");
    const [steps, setSteps] = useState<RoadmapStep[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectTopic, setSelectTopic] = useState<number>();
    const [form, setForm] = useState({
        title: "",
        description: "",
        topic_id: "",
    });

    // lay roadmapco san
    useEffect(() => {
        const fetchRoadmap = async () => {
            const res = await fetch(`${API_URL}/roadmap`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            const roadmap = await res.json();
            setSteps(roadmap.data)
        }

        const fetchTopic = async () => {
            const resTopic = await fetch(`${API_URL}/topics`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })

            const data = await resTopic.json();
            setTopics(data.data)
        }

        fetchRoadmap();
        fetchTopic();
    }, [])

    const [editId, setEditId] = useState(null);

    // Thay đổi form
    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Thêm bước
    const handleAdd = async () => {
        await fetch(`${API_URL}/roadmap/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        })

    }
    // Xoá bước
    const deleteStep = (id: any) => {
        setSteps(steps.filter((s) => s.roadmap_step_id !== id));
    };

    // Chọn sửa
    const startEdit = (step: any) => {
        setEditId(step.roadmap_step_id);
        setForm({
            title: step.title,
            description: step.description,
            topic_id: step.topic_id ?? "",
        });
    };

    // Lưu sửa
    const saveEdit = () => {
        setSteps(
            steps.map((s) =>
                s.roadmap_step_id === editId
                    ? {
                        ...s,
                        title: form.title,
                        description: form.description,
                        topic_id: Number(form.topic_id)
                    }
                    : s
            )
        );

        setEditId(null);
        setForm({ title: "", description: "", topic_id: "" });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Quản lý Roadmap</h2>

            <div className={styles.form}>
                <input
                    name="title"
                    placeholder="Tiêu đề bước..."
                    value={form.title}
                    onChange={handleChange}
                    className={styles.input}
                />

                <input
                    name="description"
                    placeholder="Mô tả..."
                    value={form.description}
                    onChange={handleChange}
                    className={styles.input}
                />

                <select
                    name="topic_id"
                    value={selectTopic}
                    onChange={handleChange}
                    className={styles.selectDropdown}
                >
                    <option value="">Chọn tiêu đề</option>
                    {topics.map((t) => (
                        <option key={t.topic_id} value={t.topic_id}>{t.title}</option>
                    ))}
                </select>

                {editId ? (
                    <Button onClick={saveEdit}>
                        Lưu
                    </Button>
                ) : (
                    <Button onClick={() => handleAdd()} >
                        Thêm
                    </Button>
                )}
            </div>

            <div className={styles.roadmapLine}>
                {steps.map((step, index) => (
                    <div key={step.roadmap_step_id} className={styles.roadmapStep}>
                        <div className={styles.stepCircle}>{index + 1}</div>
                        <div className={styles.stepContent}>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
