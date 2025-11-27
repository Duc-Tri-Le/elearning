"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import styles from "./CsvDetailPage.module.css"
import AutoResizeTextarea from "@/component/csv/autoresize/AutoResizeTextarea";
import { Button } from "@/component/ui/button/Button";

interface CsvRow {
    question: string;
    answer: string[];
}

type Change = {
    row: number,
    col: number,
    value: string
}

export default function CsvDetailPage() {
    const { name } = useParams();
    const token = Cookies.get("token");
    const [loading, setLoading] = useState(true);
    const [originalCsv, setOriginalCsv] = useState<CsvRow[]>([]);
    const [editCell, setEditCell] = useState<{ row: number, col: number } | null>(null);
    const [changes, setChanges] = useState<Change[]>([]);

    //lay gia tri 
    useEffect(() => {
        if (!name) return;
    
        try {
            const saved = localStorage.getItem(`csv_diff_${name}`);
            setChanges(saved ? JSON.parse(saved) : []);
        } catch {
            setChanges([]);
        }
    }, [name]);

    // Lấy data CSV
    useEffect(() => {
        const loadCsv = async () => {
            try {

                const url = `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/file/csv/${name}`;
                const res = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const result = await res.json();

                let cleaned: CsvRow[] = result.data.map((row: any) => {
                    const newRow: any = {};
                    Object.keys(row).forEach(key => {
                        const cleanKey = key.replace(/^\uFEFF/, '');
                        newRow[cleanKey] = row[key];
                    });

                    if (typeof newRow.answer === "string") {
                        let parsed;
                        try {
                            parsed = JSON.parse(newRow.answer);
                        } catch {
                            try {
                                const normalized = newRow.answer.replace(/'/g, '"').replace(/\\t/g, '\t');
                                parsed = JSON.parse(normalized);
                            } catch {
                                parsed = newRow.answer.replace(/^\[|\]$/g, '').replace(/['"]+/g, '').split(/\\t|, ?/);
                            }
                        }
                        newRow.answer = parsed;
                    }

                    return newRow;
                });

                cleaned = loadCsvDiff(cleaned);
                setOriginalCsv(cleaned);
            } catch (err) {
                console.error("Lỗi tải CSV:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCsv();
    }, [name, token]);

    //load csv diff
    const loadCsvDiff = (originalCsv: CsvRow[]) => {
        if (!changes) {
            localStorage.removeItem(`csv_diff_${name}`)
            return originalCsv
        }

        changes.forEach(d => {
            if (d.col === -1) originalCsv[d.row].question = d.value;
            else originalCsv[d.row].answer[d.col] = d.value;
        });
        return originalCsv;
    }

    // Xác nhận ô đang sửa
    const handleEdit = (rowIndex: number, colIndex: number) => {
        setEditCell({ row: rowIndex, col: colIndex });
    }

    // Thay đổi giá trị
    const handleChange = (rowIndex: number, colIndex: number, value: string) => {
        setOriginalCsv((prev) => {
            const updated = [...prev];
            if (colIndex === -1) updated[rowIndex].question = value;
            else updated[rowIndex].answer[colIndex] = value;
            return updated;
        });

        // Update diff
        setChanges(prev => {
            const updated = [...prev];
            const existing = updated.find(c => c.row === rowIndex && c.col === colIndex);
            if (existing) {
                existing.value = value;
            } else {
                updated.push({ row: rowIndex, col: colIndex, value });
            }
            localStorage.setItem(`csv_diff_${name}`, JSON.stringify(updated));
            return updated;
        });
    };

    // Kiểm tra ô có thay đổi so với gốc
    const isChanged = (rowIndex: number, colIndex: number) => {
        return changes.some(c => c.row === rowIndex && c.col === colIndex);
    }

    //ham reset
    const handleReset = () => {
        localStorage.removeItem(`csv_diff_${name}`);
        window.location.reload();
    }

    const handleSave = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/csv/save/${name}`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(originalCsv),
            });
            const result = await res.json();
            if (!res.ok) {
                alert(`Lỗi khi lưu: ${result.message || result.error}`);
                return;
            }
            alert("Lưu CSV thành công!");
            localStorage.removeItem(`csv_diff_${name}`);
            window.location.reload();
        } catch (err) {
            console.error("Lỗi khi lưu CSV:", err);
            alert("Có lỗi xảy ra khi lưu CSV!");
        }
    };

    const handleSaveQuestion = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/questions/create/csv/${name}`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await res.json();
            if (!res.ok) {
                alert(`Lỗi khi lưu: ${result.message || result.error}`);
                return;
            }
            alert("Lưu question vào database thành công!");
            localStorage.removeItem(`csv_diff_${name}`);
            window.location.reload();
        } catch (err) {
            console.error("Lỗi khi lưu questions:", err);
            alert("Có lỗi xảy ra khi lưu question!");
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className={styles.csv_container}>
            <h1 className={styles.title}>Chỉnh sửa CSV #{name}</h1>

            <div className={styles.button}>
                <div className={styles.button_save}>
                    <Button onClick={handleSave} variant="primary" size="md">💾 Lưu thay đổi CSV</Button>
                    <Button onClick={handleSaveQuestion} variant="primary" size="md">💾 Lưu câu hỏi vào CSDL</Button>
                </div>
                <div className={styles.reset}>
                    <Button onClick={handleReset} variant="primary" size="md">🔄 Tạo lại CSV gốc</Button>
                </div>
            </div>

            <table className={styles.table}>
                <tbody>
                    {originalCsv.map((row, index) => (
                        <tr className={styles.tr} key={index}>
                            <td
                                className={`${styles.cell} ${isChanged(index, -1) ? styles.changed : ''}`}
                                onClick={() => handleEdit(index, -1)}
                            >
                                {editCell?.row === index && editCell?.col === -1 ? (
                                    <AutoResizeTextarea
                                        value={row.question}
                                        onChange={(e) => handleChange(index, -1, e.target.value)}
                                        autoFocus
                                        setEditCell={setEditCell}
                                    />
                                ) : (
                                    row.question
                                )}
                            </td>

                            {row.answer.map((a, j) => (
                                <td
                                    key={j}
                                    className={`${styles.cell} ${isChanged(index, j) ? styles.changed : ''}`}
                                    onClick={() => handleEdit(index, j)}
                                >
                                    {editCell?.row === index && editCell?.col === j ? (
                                        <AutoResizeTextarea
                                            value={a}
                                            onChange={(e) => handleChange(index, j, e.target.value)}
                                            autoFocus
                                            setEditCell={setEditCell}
                                        />
                                    ) : (
                                        a
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
