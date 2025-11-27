"use client";

import { useEffect, useState } from "react";
import styles from "./Document.module.css";
import Cookies from "js-cookie";
import Filter from "@/component/filter/Filter/Filter";
import { useRouter } from "next/navigation";
import Search from "@/component/search/Search";
import Pagination from "@/component/pagination/Pagination";

type Document = {
    document_id: number;
    title: string;
    link?: string;
    created_at: string;
    topic_id?: number;
    available: boolean;
    topic_title : string
};

export default function DocumentPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDoc, setFilterDoc] = useState<Document[]>([]);
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const router = useRouter();

    // Lấy danh sách tài liệu
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const token = Cookies.get("token");
                const res = await fetch(`${API_URL}/documents?page=${currentPage}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Không thể lấy danh sách tài liệu");

                const data = await res.json();
                setDocuments(data.data.document);
                setTotalPage(data.data.last_page || 1);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [currentPage]);

    // Lọc tài liệu đang hoạt động
    useEffect(() => {
        setFilterDoc(documents?.filter((d) => d.available === true));
    }, [documents]);

    // Xoá tài liệu
    const handleDelete = async (docId: number) => {
        try {
            const token = Cookies.get("token");
            await fetch(`${API_URL}/documents/remove/${docId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            setDocuments((prev) => prev.filter((d) => d.document_id !== docId));
        } catch (err) {
            console.error(err);
        }
    };

    // Chuyển trạng thái hoạt động
    const handleToggleAvailable = async (docId: number, available: boolean) => {
        try {
            const token = Cookies.get("token");
            const res = await fetch(`${API_URL}/documents/setAvailable/${docId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ available }),
            });

            if (!res.ok) throw new Error("Cập nhật thất bại");

            setDocuments((prev) =>
                prev.map((d) =>
                    d.document_id === docId ? { ...d, available } : d
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Xem chi tiết tài liệu
    const detailDocument = (id: number, document: Document) => {
        localStorage.setItem("document", JSON.stringify(document));
        router.push(`/admin/documents/detail/${id}`);
    };

    if (loading)
        return <p className={styles.loading}>Đang tải danh sách tài liệu...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Quản lý tài liệu</h1>
                <div className={styles.actions}>
                    <div
                        className={styles.button}
                        onClick={() => router.push("/admin/documents/create")}
                    >
                        <button className={styles.addButton}>+ Thêm tài liệu</button>
                    </div>

                    <div className={styles.filter_search}>
                        <Filter
                            documents={documents as any}
                            setFilterDocuments={setFilterDoc as any}
                            currentPage={currentPage}
                        />
                        <Search
                            setFilterDoc={setFilterDoc as any}
                            currentPage={currentPage}
                            setTotalPage={setTotalPage}
                        />
                    </div>
                </div>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên tài liệu</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Chủ đề</th>
                        <th>Xem</th>
                        <th>Xoá</th>
                    </tr>
                </thead>
                <tbody>
                    {filterDoc?.length > 0 ? (
                        filterDoc.map((doc, index) => (
                            <tr
                                key={doc.document_id}
                                onClick={() => detailDocument(doc.document_id, doc)}
                            >
                                <td>{index + 1}</td>
                                <td>{doc.title}</td>
                                <td>{new Date(doc.created_at).toLocaleDateString("vi-VN")}</td>
                                <td
                                    className={doc.available ? styles.active : styles.inactive}
                                >
                                    {doc.available ? "Hoạt động" : "Không hoạt động"}
                                    <span
                                        className={styles.editIcon}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleAvailable(doc.document_id, !doc.available);
                                        }}
                                    >
                                        ✎
                                    </span>
                                </td>
                                <td>{doc.topic_title || "-"}</td>
                                <td>
                                    {doc.link ? (
                                        <a
                                            href={doc.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.viewBtn}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Xem
                                        </a>
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td>
                                    <button
                                        className={styles.delBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(doc.document_id);
                                        }}
                                    >
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className={styles.empty}>
                                Không có tài liệu phù hợp
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Pagination
                totalPages={totalPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
