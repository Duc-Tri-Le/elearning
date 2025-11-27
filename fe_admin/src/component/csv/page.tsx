"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { fetchCsvContent } from "@/utils/csv";
import styles from "./CsvList.module.css";
import { useRouter } from "next/navigation";

interface CsvFile {
    id: number;
    name: string;
    url: string;
}

interface CsvListProps {
    csvList: CsvFile[];
}

export default function CsvList({ csvList }: CsvListProps) {
    const [csvDataMap, setCsvDataMap] = useState<Record<number, any[]>>({});
    const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});
    const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
    const token = Cookies.get("token");
    const router = useRouter();

    const handleOpenCsv = (csv: CsvFile) => {
        router.push(`/admin/csv/${encodeURIComponent(csv.name)}`);
    }

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Danh sách file CSV</h2>

            {csvList.length === 0 && (
                <p className={styles.hint}>Không có file CSV nào trên server.</p>
            )}
            <div className={styles.csvFileContainer}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên file</th>
                            </tr>
                        </thead>
                        <tbody>
                            {csvList?.map((csv, index) => (
                                <tr key={csv.id} onClick={() => handleOpenCsv(csv)} className={styles.csvRow}>
                                    <td> {index + 1}</td>
                                    <td> {csv.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
