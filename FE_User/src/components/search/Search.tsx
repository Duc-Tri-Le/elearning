"use client";
import { useState } from "react";
import styles from "./Search.module.css";

type SearchProp = {
  setSearchKeyword: (data: any) => void;
  setFilterCondition: (data: any) => void;
}

export default function Search({ setSearchKeyword, setFilterCondition }: SearchProp) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setFilterCondition("");
  };

  const handleClear = () => {
    setKeyword("");
  };

  return (
    <div className={styles.filter}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Bạn muốn tìm kiếm..."
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
