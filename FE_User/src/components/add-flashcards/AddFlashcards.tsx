"use client";
import React, { useState, Dispatch, SetStateAction } from "react";
import styles from "./AddFlashcards.module.css";
import Cookies from "js-cookie";


type AddFlashcardsProps = {
    onClose: () => void;
    id: number
    setFlashcards: Dispatch<SetStateAction<Flashcard[]>>;
};

type Flashcard = {
    flashcard_id: number;
    front: string;
    back: string;
    example: string;
    created_at: string;
    status: string | null;
    flashcard_deck_id: number;
};

export default function AddFlashcards({ onClose, id, setFlashcards }: AddFlashcardsProps) {
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    const handleSave = async () => {
        if (!front || !back) {
            alert("Vui lòng điền đủ mặt trước và mặt sau!");
            return;
        }
        const URL_API = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
        try {
            const token = Cookies.get("token");
            const res = await fetch(`${URL_API}/flashcards/decks/add/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ front, back }),
            });

            if (!res.ok) throw new Error("Không thể lưu flashcard");

            const data = await res.json();

            // Reset form
            setFront("");
            setBack("");
            setFlashcards((prev) => [data.data, ...prev])
            // Đóng modal
            onClose();
        } catch (error) {
            console.error(error);
            alert("Lưu flashcard thất bại!");
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {/* Nút X góc trên */}
                <button className={styles.closeX} onClick={onClose}>
                    X
                </button>

                <h2 className={styles.title}>Tạo flashcard</h2>
                <div className={styles.field}>
                    <label className={styles.label}>Mặt trước</label>
                    <input
                        type="text"
                        value={front}
                        onChange={(e) => setFront(e.target.value)}
                        placeholder="Nhập mặt trước"
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Mặt sau</label>
                    <textarea
                        value={back}
                        onChange={(e) => setBack(e.target.value)}
                        placeholder="Nhập mặt sau"
                        className={styles.textareaField}
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button className={styles.saveButton} onClick={handleSave}>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}
