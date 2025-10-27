import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { ThemeProvider } from "next-themes";
import ReduxProvider from "@/components/provider/ReduxProvider";
import TokenChecker from "@/checkCookies";
import { Roboto_Slab } from "next/font/google";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-slab",
});

export const metadata: Metadata = {
  title: "Nền tảng học tập trực tuyến",
  description: "Luyện thi, ôn tập, đánh giá năng lực dễ dàng mọi lúc, mọi nơi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={robotoSlab.variable}
      suppressHydrationWarning
    >
      <body className="antialiased font-body">
        <ThemeProvider attribute="class" defaultTheme="light">
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
      </body>
    </html>
  );
}
