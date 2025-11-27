"use client";
import React, { useState, useEffect } from "react";
import styles from "./DoExam.module.css"
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";

type Answer = {
    answer_id: number;
    answer_content: string;
    is_correct: boolean;
};

type Question = {
    question_id: number;
    question_name: string;
    question_content: string;
    answers: Answer[];
};

type Exam = {
    exam_id: number;
    exam_name: string;
    created_at: string;
    time_limit: number;
    topic_id: number;
    exam_schedule_id?: number;
};

export default function DoExam() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({});
    const [timeLeft, setTimeLeft] = useState(60 * 30); // 30 phút
    const [submitted, setSubmitted] = useState(false);
    const [exam, setExam] = useState<Exam>();
    const params = useParams();
    const id = params.id;

    //dữ liệu câu hỏi
    useEffect(() => {
        const token = Cookies.get("token");
        const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
        const fetchExamId = async () => {
            const resExamId = await fetch(`${API_URL}/exams/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await resExamId.json();
            if (Array.isArray(data.data)) {
                setQuestions(data.data);
            } else {
                setQuestions([]);
            }
        }

        fetchExamId()
    }, [id]);

    // Countdown
    useEffect(() => {
        if (submitted) return;
        if (timeLeft <= 0) {
            setSubmitted(true);
            return;
        }
        const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, submitted]);

    useEffect(() => {
        const storedExam = localStorage.getItem("exam");
        if (storedExam) {
            setExam(JSON.parse(storedExam));
        }

        return () => {
            localStorage.removeItem("exam");
        };
    }, []);
    const handleSelect = (questionId: number, answerId: number) => {
        setAnswers({ ...answers, [questionId]: answerId });
    };

    const handleSubmit = () => setSubmitted(true);


    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <div className={styles.exam_container}>
            {/* Header */}
            <div className={styles.exam_header}>
                <h2>{exam?.exam_name}</h2>
            </div>

            <div className={styles.exam_body}>
                {/* Left: Questions */}
                <div className={styles.leftPanel}>
                    {submitted ? (
                        <div className={styles.result}>
                            <h3>Kết quả</h3>
                            <p>
                                Điểm của bạn: <b></b> / {questions.length}
                            </p>
                            <Button onClick={() => window.location.reload()}>Làm lại</Button>
                        </div>
                    ) : (
                        <div>
                            {questions.length > 0 ? (
                                questions?.map((q, i) => (
                                    <div key={q.question_id} className={styles.questionBox}>
                                        <p className={styles.questionText}>
                                            <strong>{i + 1}.</strong> {q.question_content}
                                        </p>
                                        <div className={styles.answers}>
                                            {q.answers.map((a) => (
                                                <label key={a.answer_id} className={styles.option}>
                                                    <input
                                                        type="radio"
                                                        name={`q-${q.question_id}`}
                                                        value={a.answer_id}
                                                        checked={answers[q.question_id] === a.answer_id}
                                                        onChange={() => handleSelect(q.question_id, a.answer_id)}
                                                    />
                                                    {a.answer_content}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <>Không có câu hỏi nào</>
                            )}
                        </div>
                    )}
                </div>

                {/* Right: Navigator */}
                <div className={styles.rightPanel}>
                    <div className={styles.topSection}>
                        <div className={styles.timer}>
                            ⏱ {formatTime(timeLeft)}
                        </div>
                        <Button variant="outline" onClick={handleSubmit}>
                            Nộp bài
                        </Button>
                    </div>
                    <div className={styles.grid}>
                        {questions.map((q, i) => (
                            <button
                                key={q.question_id}
                                className={`${styles.numButton} ${answers[q.question_id] ? styles.answered : ""
                                    }`}
                                onClick={() => {
                                    document
                                        .getElementById(`q-${q.question_id}`)
                                        ?.scrollIntoView({ behavior: "smooth" });
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
