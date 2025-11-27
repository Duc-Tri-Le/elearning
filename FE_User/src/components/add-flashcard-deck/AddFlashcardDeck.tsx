"use client"
import { useState } from "react";
import styles from "./AddFlashcardDeck.module.css";
import Cookies from "js-cookie";

interface FlashcardDecks {
    title: string;
    description: string;
}

type FlashcardDeck = {
    flashcard_deck_id: number;
    title: string;
    description: string;
    created_at: Date;
};

interface AddFlashcardDeckProps {
    setShowAddDeckForm: (value: boolean) => void;

}

export function AddFlashcardDeck({ setShowAddDeckForm, }: AddFlashcardDeckProps) {
    const [form, setForm] = useState<FlashcardDecks>({ title: "", description: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = Cookies.get("token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/flashcards/decks/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Không thể tạo deck");
            }

            const data = await res.json();
            console.log("Deck created:", data);

            // reset form
            setForm({ title: "", description: "" });
            window.location.reload();
        } catch (error: any) {
            console.error("Lỗi khi tạo deck:", error.message);
            alert("Tạo deck thất bại: " + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>Tạo list từ</h2>

            <div className={styles.formGroup}>
                <label>
                    Tiêu đề*<br />
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </label>
            </div>

            <div className={styles.formGroup}>
                <label>
                    Mô tả<br />
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className={styles.textarea}
                    />
                </label>
            </div>

            <button type="submit" className={styles.button}>Lưu</button>
        </form>
    );
}
