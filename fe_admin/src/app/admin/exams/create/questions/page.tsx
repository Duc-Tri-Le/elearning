"use client";

import { useState,useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./QuestionCreate.module.css";

interface Answer {
    answer_content: string;
    is_correct: boolean;
}

interface Question {
    question_name: string;
    question_content: string;
    answers: Answer[];
}

export default function QuestionCreate() {
    const [examId, setExamId] = useState<number>();
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");
    const [questions, setQuestions] = useState<Question[]>([
        {
            question_name: "",
            question_content: "",
            answers: [{ answer_content: "", is_correct: false }],
        },
    ]);

    useEffect(() => {
        const id = localStorage.getItem("exam_id");
        if (id) {
            setExamId(JSON.parse(id));
        }

        return () => {
            localStorage.removeItem("exam_id");
        };
    }, []);

    //Thêm câu hỏi mới
    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question_name: "",
                question_content: "",
                answers: [{ answer_content: "", is_correct: false }],
            },
        ]);
    };

    // Xóa câu hỏi
    const removeQuestion = (qIndex: number) => {
        setQuestions(questions.filter((_, i) => i !== qIndex));
    };

    //  Cập nhật nội dung câu hỏi
    const updateQuestion = <K extends keyof Question>(
        qIndex: number,
        key: K,
        value: Question[K]
    ) => {
        setQuestions((prev) =>
            prev.map((q, i) =>
                i === qIndex ? { ...q, [key]: value } : q
            )
        );
    };

    //  Thêm đáp án trong 1 câu hỏi
    const addAnswer = (qIndex: number) => {
        const updated = [...questions];
        updated[qIndex].answers.push({ answer_content: "", is_correct: false });
        setQuestions(updated);
    };

    //  Cập nhật nội dung đáp án
    const updateAnswer = <K extends keyof Answer>(
        qIndex: number,
        aIndex: number,
        key: K,
        value: Answer[K]
    ) => {
        setQuestions((prev) =>
            prev.map((q, i) =>
                i === qIndex
                    ? {
                        ...q,
                        answers: q.answers.map((a, j) =>
                            j === aIndex ? { ...a, [key]: value } : a
                        ),
                    }
                    : q
            )
        );
    };

    //  Xóa đáp án
    const removeAnswer = (qIndex: number, aIndex: number) => {
        const updated = [...questions];
        updated[qIndex].answers = updated[qIndex].answers.filter((_, i) => i !== aIndex);
        setQuestions(updated);
    };

    //  Gửi toàn bộ danh sách câu hỏi
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // kiểm tra dữ liệu trống
        for (const q of questions) {
            if (!q.question_name || !q.question_content) {
                alert("Vui lòng nhập đầy đủ thông tin cho tất cả câu hỏi!");
                return;
            }
        }

        try {
            const res = await fetch(`${API_URL}/exams/questions/create/${examId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({questions}),
            });

            const data = await res.json();

            if (res.ok) {
                alert(" Tạo nhiều câu hỏi thành công!");
                console.log("Created:", data);
                setQuestions([
                    {
                        question_name: "",
                        question_content: "",
                        answers: [{ answer_content: "", is_correct: false }],
                    },
                ]);
            } else {
                alert(data.message || "Lỗi khi tạo câu hỏi!");
            }
        } catch (err) {
            console.error(err);
            alert("Không thể kết nối server!");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tạo nhiều câu hỏi</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                {questions.map((q, qIndex) => (
                    <div key={qIndex} className={styles.questionBlock}>
                        <h3 className={styles.subtitle}>STT {qIndex + 1}</h3>

                        <input
                            type="text"
                            placeholder="Tên câu hỏi..."
                            value={q.question_name}
                            onChange={(e) => updateQuestion(qIndex, "question_name", e.target.value)}
                            className={styles.input}
                        />

                        <textarea
                            placeholder="Nội dung câu hỏi..."
                            value={q.question_content}
                            onChange={(e) => updateQuestion(qIndex, "question_content", e.target.value)}
                            className={styles.textarea}
                        />

                        <div className={styles.answersBlock}>
                            {q.answers.map((a, aIndex) => (
                                <div key={aIndex} className={styles.answerItem}>
                                    <input
                                        type="text"
                                        placeholder={`Đáp án ${aIndex + 1}`}
                                        value={a.answer_content}
                                        onChange={(e) =>
                                            updateAnswer(qIndex, aIndex, "answer_content", e.target.value)
                                        }
                                        className={styles.input}
                                    />
                                    <label className={styles.correctCheck}>
                                        <input
                                            type="checkbox"
                                            checked={a.is_correct}
                                            onChange={(e) =>
                                                updateAnswer(qIndex, aIndex, "is_correct", e.target.checked)
                                            }
                                        />
                                        Đúng
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => removeAnswer(qIndex, aIndex)}
                                        className={styles.removeBtn}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => addAnswer(qIndex)}
                                className={styles.addAnswerBtn}
                            >
                                ➕ Thêm đáp án
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => removeQuestion(qIndex)}
                            className={styles.removeQuestionBtn}
                        >
                            🗑 Xóa câu hỏi này
                        </button>

                        <hr className={styles.divider} />
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addQuestion}
                    className={styles.addQuestionBtn}
                >
                    ➕ Thêm câu hỏi mới
                </button>

                <button type="submit" className={styles.submitBtn}>
                    💾 Lưu tất cả
                </button>
            </form>
        </div>
    );
}
