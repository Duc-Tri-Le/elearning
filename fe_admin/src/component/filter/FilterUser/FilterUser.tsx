"use client";

import React, { useState, useEffect } from "react";
import styles from "./FilterUser.module.css";

type User = {
    user_id: number;
    user_name: string;
    email: string;
    birthday: string;
    created_at: string;
    available: boolean;
    role_name: string;
};

interface FilterUserProps {
    users: User[];
    setFilterUser: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function FilterUser({ users, setFilterUser }: FilterUserProps) {
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("user");
    const [status, setStatus] = useState<string>("true");

    useEffect(() => {
        if (!users || users.length === 0) return;
        
        let filtered = [...users];

        if (search.trim() !== "") {
            const keyword = search.toLowerCase();
            filtered = filtered.filter(
                (u) =>
                    u.user_name.toLowerCase().includes(keyword) ||
                    u.email.toLowerCase().includes(keyword)
            );
        }

        if (status !== "all") {
            const isAvailable = status === "true";  
            filtered = filtered.filter((u) => u.available === isAvailable);
        }
        
        if (role !== "all") {
            filtered = filtered.filter((u) => u.role_name === role);
        }
        
        setFilterUser(filtered);
    }, [search, role, status, users]);
    
    return (
        <div className={styles.container}>
            {/* Ô tìm kiếm */}
            <input
                type="text"
                placeholder="Tìm theo tên hoặc email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.input}
            />

            {/* Lọc theo vai trò */}
            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={styles.select}
            >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">NgườI quản lý</option>
                <option value="user">Người dùng</option>
            </select>

            {/* Lọc theo trạng thái */}
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={styles.select}
            >
                <option value="true">Hoạt động</option>
                <option value="all">Tất cả trạng thái</option>
                <option value="false">Bị khóa</option>
            </select>

            {/* Nút xóa lọc */}
            <button
                onClick={() => {
                    setSearch("");
                    setRole("all");
                    setStatus("all");
                }}
                className={styles.clearBtn}
            >
                Đặt lại
            </button>
        </div>
    );
}
