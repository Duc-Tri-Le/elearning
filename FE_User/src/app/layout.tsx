import type { Metadata } from "next";
import "./globals.css";
import { Roboto_Slab } from "next/font/google";
import ClientLayout from "@/lib/ThemeProvider";
import ProgressPanel from "@/components/panel-progress/page";

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
    >
      <body className="antialiased font-body">
        <ClientLayout>
          {children}
          <ProgressPanel/>
        </ClientLayout>
      </body>
    </html>
  );
}
