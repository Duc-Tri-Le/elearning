"use client";
import styles from "./Profile.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfilePage({
    children,
}: {
    children: React.ReactNode;
}) {

    const pathname = usePathname();
    const getActiveTab = () => {
        if (pathname === "/my-account") return "info";
        if (pathname === "/my-account/test") return "results";
        if (pathname === "/my-account/user-goal") return "goals";
        return "info";
    };

    const activeTab = getActiveTab();

    return (
        <main className={styles.container}>
            <div className={styles.tabs}>
                <Link
                    href={"/my-account"}
                    className={`${styles.tab} ${activeTab === "info" ? styles.active : ""
                        }`}
                >
                    Thông tin cá nhân
                </Link>
                <Link
                    href={"/my-account/test"}
                    className={`${styles.tab} ${activeTab === "results" ? styles.active : ""
                        }`}
                >
                    Kết quả luyện thi
                </Link>
                <Link
                    href={"/my-account/user-goal"}
                    className={`${styles.tab} ${activeTab === "goals" ? styles.active : ""
                        }`}
                >
                    Mục tiêu điểm số
                </Link>
            </div>
            <div className={styles.content}>
                {children}
            </div>

        </main>
    );
}
