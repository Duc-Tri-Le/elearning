"use client";
import React, { useState, useEffect } from "react";
import styles from "./BankList.module.css";
import Filter from "../filter/Filter";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setBank } from "@/store/slices/bankSlice";
import Cookies from "js-cookie";

type BankProps = {
    bank_id: number;
    description: string;
    topic_id?: number;
    available : boolean
};

export default function Bank() {
    const dispatch = useDispatch();
    const banks = useSelector((state: RootState) => state.bank.banks);
    const [filterBank, setFilterBank] = useState<BankProps[]>([])

    useEffect(() => {
        const token = Cookies.get("token");
        const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND
        const fetchBanks = async () => {
            const resBank = await fetch(`${API_URL}/banks`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await resBank.json();
            dispatch(
                setBank(data.data)
            )
        }
        fetchBanks()
    }, []);

    useEffect(() => {
        setFilterBank(banks)
    }, [banks])

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Ngân hàng câu hỏi</h1>
            {/* Bộ lọc */}
            <Filter banks={banks} setFilterBank={setFilterBank} />

            {/* Danh sách bank */}
            <div className={styles.grid}>
                {filterBank?.map((bank) => (
                    <div key={bank.bank_id} className={styles.card}>
                        <p className={styles.description}>{bank.description}</p>
                        <button className={styles.button}>Xem chi tiết</button>
                    </div>
                ))}

                {filterBank.length === 0 && (
                    <p className={styles.empty}>Không có ngân hàng nào cho chủ đề này.</p>
                )}
            </div>
        </div>
    );
}
