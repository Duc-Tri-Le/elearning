"use client";
import { useState } from "react";
import styles from "./Search.module.css";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;

type SearchProp = {
  setFilterExam: (data: any) => void;
  currentPage : number;
  setTotalPage : (data : any) => void;
};

export default function Search({ setFilterExam, currentPage, setTotalPage }: SearchProp) {
  const [searchType, setSearchType] = useState("exams");
  const [keyword, setKeyword] = useState("");

  const handleSearch = async () => {
    const token = Cookies.get("token");
    try {
      if (!keyword.trim()) {
        return;
      }
      const url = `${API_URL}/${searchType}/search?searchValue=${encodeURIComponent(
        keyword
      )}&page=${currentPage}`;
      const res = await fetch(url,{
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      setTotalPage(data.data.totalPages)
      setFilterExam(data.data.data || []);
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
    }
  };

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <div className={styles.filter}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Tìm theo tên hoặc email..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className={styles.input}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        {/* Nút xoá (chỉ hiện khi có từ khoá) */}
        {keyword && (
          <button className={styles.clearBtn} onClick={handleClear}>
            ❌
          </button>
        )}
      </div>
      {/* Nút tìm kiếm */}
      <button className={styles.searchBtn} onClick={handleSearch}>
          Tìm kiếm
        </button>
    </div>
  );
}
