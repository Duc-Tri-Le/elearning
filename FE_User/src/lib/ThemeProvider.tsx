"use client";

import { ThemeProvider } from "next-themes";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ReduxProvider from "@/components/provider/ReduxProvider";
import TokenChecker from "@/checkCookies";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class"
            defaultTheme="light"
            enableSystem={false}>
            <ReduxProvider>
                <div className="flex flex-col min-h-screen gap-8">
                    <Header />
                    <main className="flex-1 px-20 md:px-4 mt-[80px] ">
                        <>
                            <TokenChecker />
                            {children}
                        </>
                    </main>
                    <Footer />
                </div>
            </ReduxProvider>
        </ThemeProvider>
    );
}
