"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, Clock, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-white text-gray-800 font-sans">
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white py-32 px-6 text-center overflow-hidden">
        {/* Background overlay + hình */}
        {/* <div className="absolute inset-0">
          <img
            src="/hero-bg.jpg"
            alt="Học tập online"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
        </div> */}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h1 className="font-heading text-5xl md:text-6xl mb-6 leading-tight drop-shadow-lg">
            Học tập thông minh,<br />Thi thử hiệu quả
          </h1>
          <p className="font-sans text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Nền tảng học tập hiện đại – luyện đề, thi thử và đánh giá năng lực chính xác, mọi lúc, mọi nơi.
          </p>
          <Button className="font-sans bg-amber-400 hover:bg-amber-300 text-gray-900 font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            Bắt đầu học ngay
          </Button>
        </motion.div>

        {/* Hiệu ứng trang trí */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/40 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-500/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </section>

      {/* ================= FEATURED COURSES ================= */}
      <section className="py-24 bg-gray-50 text-center">
        <h2 className="font-heading text-3xl font-bold text-indigo-700 mb-12">Đề thi nổi bật</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            { title: "Toán học 12", desc: "Ôn luyện toàn diện kiến thức và bài tập theo chương." },
            { title: "Ngữ văn 12", desc: "Hệ thống bài giảng chi tiết, luyện viết & đọc hiểu." },
            { title: "Tiếng Anh THPT", desc: "Luyện ngữ pháp, từ vựng và các đề thi thật." },
            { title: "Vật lý 12", desc: "Tổng hợp bài tập trọng tâm và đề thi thử chuẩn cấu trúc." },
            { title: "Hóa học 12", desc: "Các chuyên đề nâng cao và bài tập chọn lọc." },
            { title: "Lịch sử & Địa lý", desc: "Ôn luyện nhanh, nắm vững các mốc thời gian & sự kiện." },
          ].map((course, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 text-left border border-gray-100"
            >
              <BookOpen className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">{course.title}</h3>
              <p className="font-sans text-gray-600 mb-4">{course.desc}</p>
              <Link
                href="#"
                className="text-indigo-600 font-medium inline-flex items-center hover:underline"
              >
                Xem chi tiết <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-24 text-center">
        <h2 className="font-heading text-3xl font-bold mb-12">Vì sao nên chọn chúng tôi?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            { icon: <BookOpen className="w-10 h-10 text-yellow-300 mb-3" />, title: "Đề thi đa dạng", desc: "Hàng trăm đề thi thử và bài luyện tập theo từng môn học, cập nhật thường xuyên." },
            { icon: <Award className="w-10 h-10 text-yellow-300 mb-3" />, title: "Đánh giá năng lực thông minh", desc: "Hệ thống tự động chấm điểm và phân tích chi tiết điểm mạnh, điểm yếu." },
            { icon: <Clock className="w-10 h-10 text-yellow-300 mb-3" />, title: "Học mọi lúc, mọi nơi", desc: "Luyện tập và thi thử trực tuyến trên mọi thiết bị, không cần cài đặt." },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-6 bg-white/10 backdrop-blur-md rounded-2xl"
            >
              {item.icon}
              <h3 className="font-heading text-xl font-semibold mb-2">{item.title}</h3>
              <p className="font-sans text-blue-100">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-24 bg-white text-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl font-bold text-indigo-700 mb-4">
              Về nền tảng của chúng tôi
            </h2>
            <p className="font-sans text-gray-600 mb-6">
              Chúng tôi mang đến giải pháp học tập thông minh, kết hợp công nghệ và giáo dục, giúp học sinh ôn luyện hiệu quả, làm bài thi thử như thật, và đánh giá năng lực chính xác nhất.
            </p>
            <ul className="space-y-3 font-sans text-gray-700">
              {["Kho đề thi phong phú", "Tự động chấm điểm & thống kê", "Theo dõi tiến độ học tập", "Lộ trình ôn thi thông minh"].map((item, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-indigo-600 mr-2" /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.img
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src="/students.jpg"
            alt="Students"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24 bg-gray-50 text-center">
        <h2 className="font-heading text-3xl font-bold text-indigo-700 mb-12">Học sinh nói gì?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            { name: "Lan Anh", text: "Trang web giúp mình luyện đề Toán rất hiệu quả, dễ sử dụng và có thống kê điểm rõ ràng." },
            { name: "Minh Hoàng", text: "Các đề thi thử giống thật đến 90%, nhờ đó mình tự tin hơn rất nhiều trước kỳ thi." },
            { name: "Thu Hằng", text: "Giao diện đẹp, bài học chi tiết và có phân tích điểm yếu giúp mình học tốt hơn." },
          ].map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-md">
              <p className="italic font-sans text-gray-600 mb-4">“{t.text}”</p>
              <h4 className="font-heading font-semibold text-indigo-700">{t.name}</h4>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
