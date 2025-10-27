"use client"

import { useState } from "react";
import styles from "./Login.module.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"

export default function Login() {

    const router = useRouter()

    interface SendData {
        email: string;
        password: string;
    }

    const [formData, setFormData] = useState<SendData>({
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((data) => ({ ...data, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
            if (!API_URL) throw new Error("Thiếu biến môi trường NEXT_PUBLIC_ENDPOINT_BACKEND");

            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error === "USER_NOT_FOUND") {
                    throw new Error("Không tìm thấy người dùng");
                } else if (data.error === "INVALID_PASSWORD") {
                    throw new Error("Mật khẩu không đúng");
                } else if (data.error === "EMAIL_EXISTS") {
                    throw new Error("Email đã tồn tại");
                } else {
                    throw new Error(data.message || "Đã có lỗi xảy ra");
                }
            }

            if (!data?.data?.permissions?.["admin:access"]) {
                alert("Tài khoản này không có quyền truy cập trang admin!");
                return;
            }

            Cookies.set("token", data.data.token);
            localStorage.setItem("user", JSON.stringify(data.data.user));
            localStorage.setItem("permissions", JSON.stringify(data.data.permissions));

            router.push("/admin/dashboard");
        } catch (err: any) {
            console.error("Login error:", err);
            alert(err.message || "Không thể kết nối đến server. Vui lòng thử lại sau!");
        }
    };


    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.header}>
                <h1>Đăng nhập</h1>
            </div>

            <div className={styles.change_input}>
                <div className={styles.field}>
                    <label>Email</label>
                    <input
                        name="email"
                        placeholder="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label>Mật khẩu</label>
                    <input
                        name="password"
                        placeholder="Mật khẩu"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className={styles.submit}>
                <button type="submit" className={styles.submitBtn} >
                    Đăng nhập
                </button>
            </div>
        </form>
    )
}