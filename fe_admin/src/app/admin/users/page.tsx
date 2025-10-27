"use client";

import { useEffect, useState } from "react";
import styles from "./User.module.css";
import Cookies from "js-cookie";
import FilterUser from "@/component/filter/FilterUser/FilterUser";

type User = {
  user_id: number;
  user_name: string;
  email: string;
  birthday: string;
  created_at: string;
  available: boolean;
  role_name: string;
};

export default function User() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState<User[]>([]);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get("token");
        const resUser = await fetch(`${API_URL}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        if (!resUser.ok) throw new Error("Failed to fetch users");
        const data = await resUser.json();
        setUsers(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    try {
      const token = Cookies.get("token");
      await fetch(`${API_URL}/users/remove/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.user_id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAvailable = async (userId: number, available: boolean) => {
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_URL}/users/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ available })
      });

      if (!res.ok) throw new Error("cập nhật thất bại");

      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId ? { ...u, available } : u
        )
      );
    } catch (error) {
      console.log(error);
    }
  }


  if (loading) return <p className={styles.user_loading}>Đang tải danh sách người dùng...</p>;


  //handleToggleRole

  const handleChangeRole = async (userId: number, newRole: string) => {
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_URL}/users/update/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role_name: newRole }),
      });

      if (!res.ok) throw new Error("Cập nhật vai trò thất bại");
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId ? { ...u, role_name: newRole } : u
        )
      );

      setEditingRoleId(null); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleRole = (userId: number) => {
    setEditingRoleId((prev) => (prev === userId ? null : userId));
  };
  
  return (
    <div className={styles.user_container}>
      <div className={styles.user_header}>
        <h1 className={styles.title}>Quản lý người dùng</h1>
        <div className={styles.user_add_search}>
          <div className={styles.button}>
            <button className={styles.user_addButton}>+ Thêm người dùng</button>
          </div>

          <FilterUser users={users} setFilterUser={setFilterUser} />
        </div>
      </div>

      <table className={styles.user_table}>
        <thead>
          <tr className={styles.thead}>
            <th>STT</th>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Ngày sinh</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Vai trò</th>
            <th>Xoá</th>
          </tr>
        </thead>
        <tbody>
          {filterUser.length > 0 ? (
            filterUser.map((user, index) => (
              <tr key={user.user_id} className={styles.tbody}>
                <td>{index + 1}</td>
                <td>{user.user_name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.birthday).toLocaleDateString("vi-VN")}</td>
                <td>{new Date(user.created_at).toLocaleString("vi-VN")}</td>
                <td className={user.available ? styles.active : styles.inactive}>
                  {user.available ? "Hoạt động" : "Không hoạt động"}
                  {/* ký hiệu sủa available */}
                  {user.role_name !== "admin" && (
                    <span
                      className={styles.editIcon}
                      onClick={() => handleToggleAvailable(user.user_id, !user.available)}
                    >
                      ✎
                    </span>
                  )}
                </td>
                <td className={user.role_name === "admin" ? styles.admin : styles.user}>
                  {user.role_name === "admin" ? "Admin" : "Người dùng"}
                  {/* ký hiệu sửa role */}
                  {user.role_name !== "admin" && (
                    <span
                      className={styles.editIcon}
                      onClick={() => handleToggleRole(user.user_id)}
                    >
                      ✎
                    </span>
                  )}
                  {editingRoleId === user.user_id && (
                    <div className={styles.roleGroup}>
                      <select
                        onChange={(e) =>
                          handleChangeRole(user.user_id, e.target.value)
                        }
                        defaultValue={user.role_name}
                      >
                        <option value="user">Người dùng</option>
                        <option value="admin">Quản trị</option>
                      </select>
                    </div>
                  )}
                </td>
                <td>
                  <button className={styles.delBtn} onClick={() => handleDelete(user.user_id)}>X</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className={styles.empty}>
                Không có người dùng phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
