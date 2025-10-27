"use client";
// Dùng cho exam, document, bank
import { useState, useEffect } from "react";
import styles from "./Filter.module.css";
import Cookies from "js-cookie";
import { Button } from "@/component/ui/button/Button";

interface Topic {
    topic_id: number;
    title: string;
    description?: string;
    subject_id?: number | null;
    created_at: string;
}

interface Subject {
    subject_id: number;
    subject_name: string;
}

type Exam = {
    exam_id: number;
    exam_name: string;
    created_at: string;
    time_limit: number;
    topic_id: number;
    exam_schedule_id: number;
    available: boolean;
    title: string
};

type BankProps = {
    bank_id: number;
    description: string;
    available: boolean;
    topic_id?: number
};

interface Document {
    document_id: number;
    title: string;
    link?: string;
    created_at: string;
    topic_id?: number
}

interface FilterProps {
    exams?: Exam[];
    banks?: BankProps[];
    documents?: Document[];
    setFilterExam?: React.Dispatch<React.SetStateAction<Exam[]>>
    setFilterBank?: React.Dispatch<React.SetStateAction<BankProps[]>>
    setDocuments?: React.Dispatch<React.SetStateAction<Document[]>>
}

export default function Filter(
    { exams = [], setFilterExam, banks = [], setFilterBank, documents = [], setDocuments }
        : FilterProps) {

    const [topics, setTopics] = useState<Topic[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<number | "All">("All");
    const [selectedTopic, setSelectedTopic] = useState<number | "All">("All");
    const [showFilter, setShowFilter] = useState<boolean>(false)

    // Lay data token, subject
    useEffect(() => {
        const token = Cookies.get("token")
        const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
        const fetchTopic = async () => {
            const resTopic = await fetch(`${API_URL}/topics`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })

            const data = await resTopic.json();
            setTopics(data.data)
        }

        const fetchSubject = async () => {
            const resSubject = await fetch(`${API_URL}/subjects`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await resSubject.json();
            setSubjects(data.data)
        }
        fetchTopic();
        fetchSubject()
    }, []);

    //Thay doi bo loc
    const FilterGroup = ({
        title,
        options,
        selected,
        onSelect,
    }
        : {
            title: string,
            options: { label: string, value: any }[],
            selected: any;
            onSelect: (v: any) => void;
        }) => (
        <div className={styles.filter_group}>
            <p>{title}</p>
            <div className={styles.button_container}>
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        className={selected === opt.value ? styles.selected : ""}
                        onClick={() => onSelect(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    )

    //Thay doi gia tri exam, document, bank
    const filterBySelection = <T extends { topic_id?: number }>(
        items: T[],
        topics: Topic[],
        selectedSubject: number | "All",
        selectedTopic: number | "All",
    ) => {
        if (selectedTopic !== "All") {
            return items.filter((item) => item.topic_id === selectedTopic)
        } else if (selectedSubject !== "All") {
            const topicIds = topics
                .filter((t) => t.subject_id === selectedSubject)
                .map((t) => t.topic_id)

            return items.filter((item) => item.topic_id && topicIds.includes(item.topic_id));
        }
        return items;
    }

    const handleFilter = () => {
        if (setFilterExam) {
            const filtered = filterBySelection(exams, topics, selectedSubject, selectedTopic);
            setFilterExam(filtered);
        }
        if (setFilterBank) {
            const filtered = filterBySelection(banks, topics, selectedSubject, selectedTopic);
            setFilterBank(filtered);
        }
        if (setDocuments) {
            const filtered = filterBySelection(documents, topics, selectedSubject, selectedTopic);
            setDocuments(filtered);
        }
    };

    return (
        <div className={styles.filter_container}>
            <h2 onClick={() => setShowFilter(!showFilter)}
                className={styles.filter_header}>
                {showFilter ? "▲" : "▼"} Bộ lọc
            </h2>

            {/* Filter */}
            {showFilter &&
                <div className={styles.active_border}>
                    <FilterGroup title={"Môn học"}
                        options={[{ label: "Tất cả", value: "All" },
                        ...subjects?.map((s) => ({ label: s.subject_name, value: s.subject_id }))
                        ]}
                        selected={selectedSubject}
                        onSelect={(v) => {
                            setSelectedSubject(v);
                            setSelectedTopic("All");
                        }}
                    />
                    <FilterGroup
                        title="Chủ đề"
                        options={[
                            { label: "Tất cả", value: "All" },
                            ...topics
                                ?.filter((t) => selectedSubject === "All" || t.subject_id === selectedSubject)
                                .map((t) => ({ label: t.title, value: t.topic_id })),
                        ]}
                        selected={selectedTopic}
                        onSelect={(v) => setSelectedTopic(v)}
                    />
                    {/* nut loc */}
                    <Button variant="outline" onClick={handleFilter}>
                        Lọc kết quả
                    </Button>
                </div>}
        </div>
    );
}
