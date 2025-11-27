"use client";
import { useState, useRef, useEffect } from "react";
import CurrentProgress from "@/components/current-progress/page";
import styles from "./PanelProgress.module.css";

export default function ProgressPanel() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>

            {isOpen ? (
                <div className={`${styles.slidePanel} ${isOpen ? styles.open : ""}`}>
                    <CurrentProgress setIsOpen={setIsOpen} />
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed top-40 right-5 p-2 bg-white-500 text-black rounded border border-gray-300 cursor-pointer flex flex-col items-center justify-center"
                >
                    <span>Tiến</span>
                    <span>Độ</span>
                </button>
            )}
        </>
    );
}
