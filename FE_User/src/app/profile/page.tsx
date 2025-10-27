"use client";
import { useEffect, useState } from "react";
import ProfileInfo from "@/components/profile-infor/ProfileInfor";
import ExamResults from "@/components/history-exam/HistoryExam";
import styles from "./Profile.module.css";

interface User {
    user_name: string;
    email: string;
    birthday?: string;
    created_at?: string;
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"info" | "results">("info");
    const [user, setUser] = useState<User>({
        user_name: "",
        email: "",
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <p style={{ textAlign: "center" }}>Đang tải...</p>;
    }

    return (
        <main className={styles.container}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === "info" ? styles.active : ""
                        }`}
                    onClick={() => setActiveTab("info")}
                >
                    Thông tin cá nhân
                </button>
                <button
                    className={`${styles.tab} ${activeTab === "results" ? styles.active : ""
                        }`}
                    onClick={() => setActiveTab("results")}
                >
                    Kết quả luyện thi
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === "info" ? <ProfileInfo user={user} /> : <ExamResults />}
            </div>
        </main>
    );
}
