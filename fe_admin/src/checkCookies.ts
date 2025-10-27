"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";


export default function TokenChecker() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        if (Date.now() >= exp * 1000) {
          // Token hết hạn: xoá mọi thứ & logout
          Cookies.remove("token");
          localStorage.clear();
          window.location.href = "/login"
        }
      } catch (e) {
        console.error("Không thể decode token:", e);
      }
    };

    // Kiểm tra ngay khi load lần đầu
    checkToken();

    // Kiểm tra lại mỗi phút
    const interval = setInterval(checkToken, 60 * 1000);
    return () => clearInterval(interval);
  }, [router]);

  return null; 
}
