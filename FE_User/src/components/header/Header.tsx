"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/userSlices";
import Setting from "../setting/Setting";
import styles from "./Header.module.css";
import Image from "next/image";

export default function Header() {
  const [showSetting, setShowSetting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const userRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsClient(true);
    setUserName(localStorage.getItem("user_name"));
    setToken(Cookies.get("token") || null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_name");
    Cookies.remove("token");
    setIsClient(false)
    dispatch(logout());
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowSetting(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const listNavbar = [
    { name: "Thi thử", href: "/exam" },
    { name: "Luyện tập", href: "/practice" },
    { name: "Thẻ ghi nhớ", href: "/flashcards" },
    { name: "Lộ trình", href: "/roadmap" },
    { name: "Tài liệu", href: "/document" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoWrapper}>
              <Image
                src="/logo.svg"
                alt="logo"
                fill
                priority
                style={{ objectFit: "contain" }}
              />
            </span>
            <p className={styles.logoText}>
              LÒ LUYỆN <span>ONLINE</span>
            </p>
          </Link>
        </div>
        <div className={styles.right}>
          <nav className={styles.nav}>
            {listNavbar.map((item, idx) => (
              <Link key={idx} href={item.href} className={styles.navItem}>
                {item.name}
              </Link>
            ))}
          </nav>
          {isClient && token ? (
            <div className={styles.user} ref={userRef}>
              <div
                className={styles.avatar}
                onClick={() => setShowSetting(!showSetting)}
              >
                {userName?.[0] || "Tài khoản"}
              </div>
              {showSetting && <Setting onLogout={handleLogout} />}
            </div>
          ) : (
            <div className={styles.auth}>
              <Link href="/login" className={styles.login}>
                Đăng nhập
              </Link>
              <Link href="/register" className={styles.register}>
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
