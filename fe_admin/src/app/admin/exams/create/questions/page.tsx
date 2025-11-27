"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./QuestionCreate.module.css";
import { fetchQuestions } from "@/utils/question.service";
import Pagination from "@/component/pagination/Pagination";
import Search from "@/component/search/Search";
import { fetchCsvContent } from "@/utils/csv";
import { Button } from "@/component/ui/button/Button";
import { useSearchParams } from "next/navigation";

interface Answer {
    answer_id: number;
    answer_content: string;
    is_correct: boolean;
}

interface Question {
    question_id: number;
    question_name: string;
    question_content: string;
    available: boolean;
    answers: Answer[];
    sourrce: string
}

interface CsvFile {
    id: number;
    name: string;
    url: string;
}

export default function QuestionCreate() {
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [filterQuestion, setFilterQuestion] = useState<Question[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [csvList, setCsvList] = useState<CsvFile[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<{ exam_id: number, question_id: number }[]>([]);
    const searchParams = useSearchParams();
    const examId = Number(searchParams.get("exam_id"));
    const type = searchParams.get("type");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchQuestions(API_URL!, currentPage, token!);
                setQuestions(data.data.question);
                setTotalPage(data.data.totalPages);
            } catch (err) {
                console.error("Lỗi khi fetch question:", err);
            } finally {
                setLoading(false);
            }
        };

        const handleFetchCsv = async () => {
            const url = `${API_URL}/file/csv`;
            const data = await fetchCsvContent(url, token);
            setCsvList(data)
        };

        fetchData();
        handleFetchCsv();
    }, [currentPage]);

    //Lọc các câu hỏi đang hoạt động (optional)
    useEffect(() => {
        setFilterQuestion(questions?.filter((q) => q.available === true));
    }, [questions]);

    const handleFilter = async (source: string) => {
        try {
            const res = await fetch(`${API_URL}/questions/filter?source=${source}&page=${currentPage}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Lỗi khi fetch dữ liệu");

            const data = await res.json()

            // Giả sử bạn muốn cập nhật state
            setQuestions(data.data.questions);
            setTotalPage(data.totalPage);
        } catch (error) {
            console.error("handleFilter error:", error);
        }
    };

    const handleSelectQuestion = (questionId: number) => {

        setSelectedQuestions((prev) => {
            const exists = prev.some((x) => x.question_id === questionId);

            if (exists) {
                return prev.filter((x) => x.question_id !== questionId);
            }

            return [...prev, { exam_id: examId, question_id: questionId }];
        });
    };

    const handleReset = () => {
        window.location.reload();
    }

    const handleCretaeExamQuestion = async () => {
        try {
            const res = await fetch(`${API_URL}/exams/questions/add`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                },
                body : JSON.stringify({ selectedQuestions })
            })
            
        } catch (error) {
            console.error("error:", error);
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tạo câu hỏi</h1>

            {/* loc */}
            <div className={styles.action}>
                <Search setFilterQuestion={setFilterQuestion} currentPage={currentPage} setTotalPage={setTotalPage} />
                {/* Dropdown select */}
                <select
                    value={selectedOption}
                    onChange={async (e) => {
                        const value = (e.target as HTMLSelectElement).value;
                        setSelectedOption(value);
                        await handleFilter(value);
                    }}
                    className={styles.selectDropdown}
                >
                    <option value="">Chọn nguồn câu hỏi</option>
                    {csvList.map((csv) => (
                        <option key={csv.id} value={csv.name}>{csv.name}</option>
                    ))}

                </select>
                {/* reset */}
                <div className={styles.button}><Button onClick={() => handleReset()}>Đặt lại</Button></div>

                {/* Thêm câu hỏi cho bài kiểm tra */}
                <div className={styles.button}><Button onClick={() => handleCretaeExamQuestion()}>Hoàn thành</Button></div>

            </div>
            {/* Bảng danh sách câu hỏi */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Dạng câu hỏi</th>
                        <th>Nội dung</th>
                        <th>Đáp án</th>
                        <th>Chọn câu hỏi</th>
                    </tr>
                </thead>
                <tbody>
                    {filterQuestion?.length > 0 ? (
                        filterQuestion.map((q, index) => (
                            <tr key={q.question_id}>
                                <td>{index + 1}</td>
                                <td>{q.question_name}</td>
                                <td>{q.question_content}</td>
                                <td>
                                    <ul className={styles.answers}>
                                        {q.answers.map((a) => (
                                            <li key={a.answer_id}>
                                                {a.answer_content}{" "}
                                                {a.is_correct && <strong>(✔)</strong>}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedQuestions.some(item => item.question_id === q.question_id)}
                                        onChange={() => handleSelectQuestion(q.question_id)}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className={styles.empty}>
                                Không có câu hỏi nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* phan trang */}
            <Pagination totalPages={totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />

        </div>
    );
}
