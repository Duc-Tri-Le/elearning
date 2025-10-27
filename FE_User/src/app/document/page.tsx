"use client";
import { useState, useEffect } from "react";
import styles from "./DocumentList.module.css";
import Filter from "@/components/filter/Filter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setDocument } from "@/store/slices/documentSlice";

interface Document {
    document_id: number;
    title: string;
    link?: string;
    created_at: string;
    topic_id?: number;
}

export default function DocumentList() {
    const dispatch = useDispatch();
    const documents = useSelector((state : RootState) => state.document.documents)
    // 🧠 Giả lập dữ liệu giống với bảng SQL document
    useEffect(() => {
        const mockData: Document[] = [
            {
                document_id: 1,
                title: "Hướng dẫn sử dụng hệ thống CRM",
                link: "https://example.com/docs/crm-guide.pdf",
                created_at: "2025-10-10T09:15:00Z",
                topic_id: 1,
            },
            {
                document_id: 2,
                title: "Báo cáo doanh thu quý 3/2025",
                link: "https://example.com/docs/sales-q3.pdf",
                created_at: "2025-10-05T14:30:00Z",
                topic_id: 2,
            },
            {
                document_id: 3,
                title: "Kế hoạch marketing 2026",
                link: "",
                created_at: "2025-09-20T08:00:00Z",
                topic_id: 2,
            },
            {
                document_id: 4,
                title: "Tài liệu đào tạo nhân viên mới",
                link: "https://example.com/docs/training.pdf",
                created_at: "2025-08-15T10:00:00Z",
                topic_id: 3,
            },
            {
                document_id: 5,
                title: "Hướng dẫn bảo mật thông tin khách hàng",
                link: "https://example.com/docs/security.pdf",
                created_at: "2025-07-25T13:20:00Z",
                topic_id: 1,
            },
            {
                document_id: 6,
                title: "Quy trình chăm sóc khách hàng",
                link: "https://example.com/docs/customer-service.pdf",
                created_at: "2025-06-30T15:45:00Z",
                topic_id: 1,
            },
        ];

        dispatch(
            setDocument(
                mockData
            )
        )
    }, []);


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tài liệu của tôi</h1>

            {/* Bộ lọc */}
            {/* <Filter documents={documents} setDocuments={setDocuments} /> */}
            <div className={styles.list}>
                {documents.length === 0 ? (
                    <p className={styles.empty}>Không có tài liệu nào phù hợp.</p>
                ) : (
                    documents.map((doc) => (
                        <div key={doc.document_id} className={styles.card}>
                            <h3 className={styles.docTitle}>{doc.title}</h3>

                            {doc.link ? (
                                <a
                                    href={doc.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.link}
                                >
                                    🔗 Xem tài liệu
                                </a>
                            ) : (
                                <p className={styles.noLink}>Không có link</p>
                            )}

                            <p className={styles.date}>
                            📅 Ngày tạo: {new Date(doc.created_at).toLocaleString("vi-VN")}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
