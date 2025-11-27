"use client";
import { useEffect, useState } from "react";
import styles from "./Search.module.css";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
const token = Cookies.get("token");

type SearchProp = {
  setFilterExam?: (data: any) => void;
  currentPage: number;
  setTotalPage: (data: any) => void;
  setFilterDoc?: (data: any) => void;
  setFilterQuestion?: (data: any) => void;
  setFilterBank?: (data: any) => void;
};

type SearchType = "exams" | "documents" | "questions" | "banks";

export default function Search({ setFilterExam, setFilterQuestion, setFilterBank, currentPage, setTotalPage, setFilterDoc }: SearchProp) {
  const [searchType, setSearchType] = useState<SearchType>("exams");
  const [keyword, setKeyword] = useState("");


  const placeholderMap: Record<SearchType, string> = {
    exams: "Tìm theo tên đề thi, tiêu đề...",
    documents: "Tìm theo tên tài liệu...",
    questions: "Tìm theo nội dung, dạng câu hỏi, và câu trả lời",
    banks: "Tìm theo ngân hàng câu hỏi...",
  };
  
  useEffect(() => {
    if (setFilterExam) {
      setSearchType("exams")
    }
    if (setFilterBank) {
      setSearchType("banks");
    }
    if (setFilterDoc) {
      setSearchType("documents");
    }
    if (setFilterQuestion) {
      setSearchType("questions");
    }

  }
    , []);

  const handleSearch = async () => {
    let routes = "exams"
    if (setFilterBank) {
      routes = "banks";
    }
    if (setFilterDoc) {
      routes = "documents"
    }
    if (setFilterQuestion) {
      routes = "questions"
    }

    try {
      if (!keyword.trim()) {
        return;
      }
      const url = `${API_URL}/${searchType}/search?searchValue=${encodeURIComponent(
        keyword
      )}&page=${currentPage}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (setFilterExam && routes === "exams") {
        setFilterExam(data.data.data || []);
      } else if (setFilterBank && routes === "banks") {
        setFilterBank(data.data.data || []);
      } else if (setFilterDoc && routes === "documents") {
        setFilterDoc(data.data.data || []);
      } else if (setFilterQuestion && routes === "questions") {
        setFilterQuestion(data.data.data || [])
      }
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err);
    }
  };

  //hiển thị placeholder
  const placeholder = [
    ""
  ]

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <div className={styles.filter}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder={placeholderMap[searchType]}
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
