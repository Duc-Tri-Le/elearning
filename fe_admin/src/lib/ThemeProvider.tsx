"use client";

import { ThemeProvider } from "next-themes";
import Sidebar from "@/component/sidebar/Sidebar";
import Header from "@/component/header/Header";
import TokenChecker from "@/checkCookies";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="relative flex min-h-screen bg-gray-50 overflow-visible">
        <Sidebar />
        <div className="relative flex-1 flex flex-col w-full ml-60">
          <Header />
          <main className="sticky top-0 z-5 flex-1 p-6 w-full">
            <TokenChecker />
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
