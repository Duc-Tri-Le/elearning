"use client";
import React, { useState, useEffect } from "react";
import styles from "./BankList.module.css";
import Filter from "../filter/Filter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setBank } from "@/store/slices/bankSlice";
import Cookies from "js-cookie";
import Pagination from "../pagination/Pagination";
import Search from "../search/Search";

type BankProps = {
    bank_id: number;
    description: string;
    topic_id?: number;
    available: boolean
};

export default function Bank() {
    const dispatch = useDispatch();
    const banks = useSelector((state: RootState) => state.bank.banks);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [filterCondition, setFilterCondition] = useState<any>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    useEffect(() => {
        const token = Cookies.get("token");
        const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;

        const fetchBanks = async () => {
            let url = `${API_URL}/banks?page=${currentPage}`;

            // Filter topics
            if (filterCondition?.topics && filterCondition.topics.length > 0) {
                url += `&topics=${filterCondition.topics.join(",")}`;
            }

            // Search
            if (searchKeyword.trim().length > 0) {
                url += `&search=${encodeURIComponent(searchKeyword)}`;
            }

            const resBank = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await resBank.json();

            dispatch(setBank(data.data.banks));
            setTotalPages(data.data.totalPages);
        };

        fetchBanks();
    }, [currentPage, filterCondition, searchKeyword]);


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Ngân hàng câu hỏi</h1>
            {/* Bộ lọc */}
            <div className={styles.filter_search}>
                <Filter
                    setFilterCondition={setFilterCondition}
                    setSearchKeyword={setSearchKeyword}
                />

                <Search
                    setSearchKeyword={setSearchKeyword}
                    setFilterCondition={setFilterCondition}
                />
            </div>

            {/* Danh sách bank */}
            <div className={styles.grid}>
                {banks?.map((bank) => (
                    <div key={bank.bank_id} className={styles.card}>
                        <p className={styles.description}>{bank.description}</p>
                        <button className={styles.button}>Xem chi tiết</button>
                    </div>
                ))}

                {banks.length === 0 && (
                    <p className={styles.empty}>Không có ngân hàng nào cho chủ đề này.</p>
                )}
            </div>

            {/* phan trang */}
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div >
    );
}
