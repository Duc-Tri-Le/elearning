"use client";
import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import styles from "./ProfileInfor.module.css";
import Cookies from "js-cookie";

interface User {
    user_name: string;
    email: string;
    birthday?: string;
    created_at?: string;
}

interface ProfileInfoProps {
    user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
    const [form, setForm] = useState({
        username: "",
        name: "",
        email: "",
        dob: "",
    });

    const [editing, setEditing] = useState({
        name: false,
        email: false,
        dob: false,
    });

    useEffect(() => {
        if (user) {
            setForm({
                username: user.user_name || "",
                name: user.user_name || "",
                email: user.email || "",
                dob: user.birthday ? user.birthday.split("T")[0] : "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleEdit = (field: keyof typeof editing) => {
        setEditing({ ...editing, [field]: !editing[field] });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = Cookies.get("token")
        if (!user) return;

        // So sánh và lấy ra những trường thay đổi
        const updatedData: any = {};

        if (form.name && form.name !== user.user_name) {
            updatedData.user_name = form.name;
        }

        if (form.email && form.email !== user.email) {
            updatedData.email = form.email;
        }

        if (form.dob && form.dob !== (user.birthday?.split("T")[0] || "")) {
            updatedData.birthday = form.dob;
        }

        // Nếu không có gì thay đổi thì thông báo
        if (Object.keys(updatedData).length === 0) {
            alert("Không có thay đổi nào để lưu.");
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_ENDPOINT_BACKEND}/users/update`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedData),
                }
            );

            if (!res.ok) {
                throw new Error("Cập nhật thất bại");
            }

            const data = await res.json();
            alert("Cập nhật thành công!");

            setEditing({ name: false, email: false, dob: false });
            localStorage.setItem("user", JSON.stringify(data.data));

        } catch (err) {
            console.error(err);
            alert("Đã xảy ra lỗi khi cập nhật thông tin!");
        }
    };


    return (
        <section className={styles.profileForm}>
            <h3>Hồ Sơ Của Tôi</h3>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

            <form onSubmit={handleSubmit}>
                <label className={styles.row}>
                    <span>Tên</span>
                    <div className={styles.inputGroup}>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            disabled={!editing.name}
                        />
                        <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={() => toggleEdit("name")}
                            title={editing.name ? "Hủy" : "Chỉnh sửa"}
                        >
                            {editing.name ? <X size={18} /> : <Pencil size={18} />}
                        </button>
                    </div>
                </label>

                <label className={styles.row}>
                    <span>Email</span>
                    <div className={styles.inputGroup}>
                        <input
                            name="email"
                            value={
                                editing.email
                                  ? form.email 
                                  : form.email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => a + "*".repeat(b.length))
                              }
                            onChange={handleChange}
                            disabled={!editing.email}
                        />
                        <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={() => toggleEdit("email")}
                            title={editing.email ? "Hủy" : "Chỉnh sửa"}
                        >
                            {editing.email ? <X size={18} /> : <Pencil size={18} />}
                        </button>
                    </div>
                </label>

                <label className={styles.row}>
                    <span>Ngày sinh</span>
                    <div className={styles.inputGroup}>
                        <input
                            type="date"
                            name="dob"
                            value={form.dob}
                            onChange={handleChange}
                            disabled={!editing.dob}
                        />
                        <button
                            type="button"
                            className={styles.iconBtn}
                            onClick={() => toggleEdit("dob")}
                            title={editing.dob ? "Hủy" : "Chỉnh sửa"}
                        >
                            {editing.dob ? <X size={18} /> : <Pencil size={18} />}
                        </button>
                    </div>
                </label>

                <button type="submit" className={styles.saveBtn}>
                    Lưu thay đổi
                </button>
            </form>
        </section>
    );
}
