"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./question.module.css";
import Cookies from "js-cookie";
import Pagination from "@/component/pagination/Pagination";
import Search from "@/component/search/Search";
import { fetchCsvContent, uploadCsvFile } from "@/utils/csv";
import { Button } from "@/component/ui/button/Button";
import CsvList from "@/component/csv/page";
import { fetchQuestions } from "@/utils/question.service";

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
    source : string
}

interface CsvFile {
    id: number;
    name: string;
    url: string;
}

export default function Question() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [filterQuestion, setFilterQuestion] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [isCsvList, setIsCsvList] = useState<boolean>(false);
    const [csvList, setCsvList] = useState<CsvFile[]>([]);
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");
    const csvInputRef = useRef<HTMLInputElement>(null);
    const docxInputRef = useRef<HTMLInputElement>(null);

    // Lấy danh sách câu hỏi
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

        fetchData();
    }, [currentPage]);
    //Lọc các câu hỏi đang hoạt động (optional)
    useEffect(() => {
        setFilterQuestion(questions?.filter((q) => q.available === true));
    }, [questions]);

    // Xoá câu hỏi
    const handleDelete = async (questionId: number) => {
        try {
            const token = Cookies.get("token");
            const res = await fetch(`${API_URL}/questions/remove/${questionId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Xoá thất bại");

            setQuestions((prev) =>
                prev.filter((q) => q.question_id !== questionId)
            );
        } catch (err) {
            console.error("Lỗi xoá:", err);
        }
    };

    // Chuyển trạng thái hiển thị câu hỏi
    const handleToggleAvailable = async (questionId: number, available: boolean) => {
        try {
            const token = Cookies.get("token");
            const res = await fetch(`${API_URL}/questions/setAvailable/${questionId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ available }),
            });

            if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");

            setQuestions((prev) =>
                prev.map((q) =>
                    q.question_id === questionId ? { ...q, available } : q
                )
            );
        } catch (error) {
            console.error(" Lỗi khi đổi trạng thái:", error);
        }
    };

    //lay list csv tu server
    const handleFetchCsv = async () => {
        const url = `${API_URL}/file/csv`;
        const data = await fetchCsvContent(url, token);
        setCsvList(data)
        setIsCsvList(true)
    };

    // Upload CSV từ máy
    const handleUploadCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const url = `${API_URL}/file/csv/save/${file.name}`;
        const result = await uploadCsvFile(url, file, token);
        console.log("Kết quả upload:", result);
    };

    // Upload DOCX từ máy
    const handleUploadDocx = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const url = `${API_URL}/file/docx/save/${file.name}`;
        const result = await uploadCsvFile(url, file, token);
        console.log("Kết quả upload:", result);
    };

    //  Loading
    if (loading)
        return <p className={styles.loading}>Đang tải danh sách câu hỏi...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Quản lý câu hỏi</h1>
                <div className={styles.actions}>
                    <Search setFilterQuestion={setFilterQuestion} currentPage={currentPage} setTotalPage={setTotalPage} />

                    <div className={styles.csv}>
                        <input
                            type="file"
                            accept=".docx"
                            ref={docxInputRef}
                            style={{ display: "none" }}
                            onChange={handleUploadDocx}
                        />

                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => docxInputRef.current?.click()}>
                            Thêm câu hỏi từ DOCX
                        </Button>
                    </div>

                    {/* Upload CSV */}
                    <div className={styles.csv}>
                        <input
                            type="file"
                            accept=".csv"
                            ref={csvInputRef}
                            style={{ display: "none" }}
                            onChange={handleUploadCsv}
                        />

                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => csvInputRef.current?.click()}>
                            Thêm câu hỏi từ CSV
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleFetchCsv}
                        >
                            Danh sách CSV
                        </Button>
                    </div>

                </div>
            </div>

            {isCsvList && (
                <div className={styles.overlay}>
                    <div className={styles.csvModal}>
                        <div className={styles.csvHeader}>
                            <h2>Danh sách CSV</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setIsCsvList(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <CsvList csvList={csvList} />
                    </div>
                </div>
            )}
            {/* Bảng danh sách câu hỏi */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Dạng câu hỏi</th>
                        <th>Nội dung</th>
                        <th>Đáp án</th>
                        <th>Trạng thái</th>
                        <th>Xóa</th>
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
                                <td
                                    className={q.available ? styles.active : styles.inactive}
                                    onClick={() =>
                                        handleToggleAvailable(q.question_id, !q.available)
                                    }
                                >
                                    {q.available ? "Hoạt động" : "Ẩn"}
                                </td>
                                <td>
                                    <button
                                        className={styles.delBtn}
                                        onClick={() => handleDelete(q.question_id)}
                                    >
                                        X
                                    </button>
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

            {/* Phân trang */}
            <Pagination
                totalPages={totalPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
