"use client";
import Link from "next/link";
import styles from "./Setting.module.css";

type SettingProps = {
    onLogout : () => void
}

export default function Setting({ onLogout } : SettingProps) {
  return (
    <div className={styles.dropdown}>
      <ul className={styles.menu}>
        <li><Link href="/schedule">Lịch học của tôi</Link></li>
        <li><Link href="/profile">Trang cá nhân</Link></li>
        <li onClick={onLogout} className={styles.logout}>Đăng xuất</li>
      </ul>
    </div>
  );
}
