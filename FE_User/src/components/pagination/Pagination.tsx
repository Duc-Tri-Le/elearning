"use client"
import styles from "./Pagination.module.css"
import { ChevronRight, ChevronLeft } from "lucide-react";

type PaginationProps = {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: any) => void;
};

export default function Pagination({ totalPages, currentPage, setCurrentPage }: PaginationProps) {

    const maxVisible = 5;
    const pages: (number | string)[] = [];

    //them trang dau va trang cuoi
    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= Math.floor(maxVisible / 2) + 1) {
        for (let i = 1; i <= maxVisible; i++) pages.push(i);
    } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
            if (i >= 1) pages.push(i);
        }
    } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            if (i >= 1 && i <= totalPages) pages.push(i);
        }
    }
    return (
        <div className={styles.pagination}>
            <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
                <ChevronLeft size={18} />
            </button>

            {pages.map((page, idx) =>
                typeof page === "number" ? (
                    <button
                        key={idx}
                        onClick={() => setCurrentPage(page)}
                        className={page === currentPage ? styles.activePage : ""}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={idx} className={styles.ellipsis}>
                        {page}
                    </span>
                )
            )}

            <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
                <ChevronRight size={18} />
            </button>
        </div>
    );
}
