"use client"
import styles from "./Search.module.css"

export default function Search() {
    return (
        <div className={styles.search_element}>
            <input
                type="text"
                placeholder="Tìm kiếm..."
                className={styles.search_input}
            />
        </div>
    )
}