"use client";

import { usePathname } from "next/navigation";
import { Home, Users, FileText, BookOpen, Settings, Calendar, Clock, Map } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Sidebar.module.css";

const navItems = [
  { name: "Bảng điều khiển", href: "/admin/dashboard", icon: Home },
  { name: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Bài thi", href: "/admin/exams", icon: BookOpen },
  { name: "Tài liệu", href: "/admin/documents", icon: FileText },
  { name: "Câu hỏi", href: "/admin/questions", icon: Settings },
  { name: "Lịch thi", href: "/admin/schedules", icon: Calendar },
  { name: "Lộ trình", href: "/admin/roadmap", icon: Map },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
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

        <nav className={styles.nav}>
          {navItems.map(({ name, href, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={name}
                href={href}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              >
                <Icon size={18} />
                <span>{name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.adminButton}>Be Admin</button>
      </div>
    </aside>
  );
}
