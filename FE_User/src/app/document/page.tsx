"use client";
import { useState, useEffect } from "react";
import styles from "./DocumentList.module.css";
import Filter from "@/components/filter/Filter";
import Cookies from "js-cookie";
import Link from "next/link";

interface Document {
    document_id: number;
    title: string;
    link?: string;
    created_at: string;
    topic_id?: number;
    available: boolean
}

export default function DocumentList() {
    const [document, setDocument] = useState<Document[]>([]);
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);

    useEffect(() => {
        const token = Cookies.get("token");
        const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;

        const fetchDocuments = async () => {
            try {
                const res = await fetch(`${API_URL}/documents?page=${currentPage}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();
                if (res.ok) {
                    setDocument(data.data.document);
                } else {
                    console.error("Error fetching documents:", data.message);
                }
            } catch (err) {
                console.error("Failed to fetch documents:", err);
            }
        };

        fetchDocuments();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Tài liệu của tôi</h1>

            {/* Bộ lọc */}
            {/* <Filter documents={documents} setDocuments={setDocuments} /> */}
            <div className={styles.list}>
                {document.length === 0 ? (
                    <p className={styles.empty}>Không có tài liệu nào phù hợp.</p>
                ) : (
                    document?.map((doc) => (

                        <div key={doc.document_id} className={styles.card}>
                            <h3 className={styles.docTitle}>{doc.title}</h3>

                            {doc.link ? (
                                <Link href={`/document/${doc.document_id}?link=${doc.link}`} target="_blank" className={styles.link}>
                                    🔗 Xem tài liệu
                                </Link>
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
