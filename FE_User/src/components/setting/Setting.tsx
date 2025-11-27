"use client";
import Link from "next/link";
import styles from "./Setting.module.css";

type SettingProps = {
    onLogout : () => void,
    setShowSetting : (d : boolean) => void
}

export default function Setting({ onLogout, setShowSetting } : SettingProps) {
  return (
    <div className={styles.dropdown}>
      <ul className={styles.menu}>
        <li onClick={() => setShowSetting(false)}><Link href="/schedule/study">Lịch học của tôi</Link></li>
        <li onClick={() => setShowSetting(false)}><Link href="/my-account">Trang cá nhân</Link></li>
        <li onClick={onLogout} className={styles.logout}>Đăng xuất</li>
      </ul>
    </div>
  );
}
