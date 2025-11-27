import { useState, useEffect, useRef } from "react";
import styles from "./AutoResizeTextarea.module.css";

export default function AutoResizeTextarea({
    value,
    onChange,
    autoFocus = false,
    setEditCell,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    autoFocus?: boolean;
    setEditCell: React.Dispatch<React.SetStateAction<{ row: number; col: number } | null>>;
}) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            autoFocus={autoFocus}
            onBlur={() => setEditCell(null)}
            className={`${styles.textarea}`}
        />
    );
}
