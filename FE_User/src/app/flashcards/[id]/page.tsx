"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import styles from "./Flashcards.module.css";
import Cookies from "js-cookie";
import Pagination from "@/components/pagination/Pagination";
import AddFlashcards from "@/components/add-flashcards/AddFlashcards";
import { useRouter } from "next/navigation";

type Flashcard = {
  flashcard_id: number;
  front: string;
  back: string;
  example: string;
  created_at: string;
  status: string | null;
  flashcard_deck_id: number;
};

export default function FlashcardDetail() {
  const { id } = useParams();
  const searchParam = useSearchParams()
  const flashcard_deck_title = searchParam.get("flashcard_deck_title")
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(1);
  const [totalItem, setTotalItem] = useState<number>();
  const [totalDone, setTotalDone] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterFlashcard, setFilterFlashCard] = useState<Flashcard[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND;
  const router = useRouter();

  //phan trang
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const start = (currentPage - 1) * 10;
    const end = start + 10;
    setFilterFlashCard(flashcards.slice(start, end));
  }, [currentPage, flashcards]);

  // Gọi API lấy danh sách flashcard của deck
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const token = Cookies.get("token");
        const res = await fetch(
          `${API_URL}/flashcards/decks/${id}?page=${currentPage}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Không thể lấy danh sách flashcard");
        const json = await res.json();
        setFlashcards(json.data.data);
        setTotalDone(json.data.totalDone);
        setTotalItem(json.data.totalFlashcard);
        setTotalPage(Math.ceil(json.data.totalFlashcard / 10));
      } catch (error) {
        console.error("Lỗi khi fetch flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [id]);

  // xoa flashcards decks
  const deleteDeck = async () => {
    const token = Cookies.get("token");
    try {
      await fetch(`${API_URL}/flashcards/decks/remove/${id}`,{
        method : "DELETE",
        headers : {
          "Content-Type" : "application/json",
          Authorization : `Beare ${token}`
        }
      })
      router.push("/flashcards")
    } catch (error : any) {
      console.log(error);      
    }
  }
  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{flashcard_deck_title}</h1>
      <div className={styles.play}>
        <div className={styles.btn_add_update_delete}>
          <button className={styles.btn_add} onClick={() => setShowAddModal(true)}>Thêm flashcard</button>
          <button className={styles.btn_update}>Chỉnh sửa</button>
          <button className={styles.btn_delete} onClick={deleteDeck}>Xoá</button>
        </div>
        {flashcards.length !== 0 &&
          <div className={styles.btn_route}>
            <a className={styles.btn_play} href={`/flashcards/${id}/quiz`}>Luyện tập Flashcard</a>
            <a className={styles.btn_play} href={`/flashcards/${id}/review`}>Ôn tập Flashcard</a>
          </div>
        }
      </div>
      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span className={styles.number}>{totalItem}</span>
          <span className={styles.label}>Tổng số từ</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.number}>{totalDone}</span>
          <span className={styles.label}>Số từ đã học</span>
        </div>
      </div>
      {filterFlashcard.length === 0 ? (
        <p>Chưa có thẻ flashcard nào trong bộ này.</p>
      ) : (
        <div>
          <div className={styles.grid}>
            {filterFlashcard.map((card, index) => (
              <div key={index} className={styles.card}>
                <h3 className={styles.front}>{card.front}</h3>
                <p className={styles.back}><strong>Đáp án:</strong> {card.back}</p>
                {card.example && (
                  <p className={styles.example}><strong>Ví dụ:</strong> {card.example}</p>
                )}
                <p className={styles.date}>
                  Ngày tạo: {new Date(card.created_at).toLocaleString("vi-VN", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            ))}
          </div>
          <div className={styles.pagination}>
            <Pagination totalPages={totalPage} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      )}

      {showAddModal && <AddFlashcards onClose={() => setShowAddModal(false)} id={Number(id!)} setFlashcards={setFlashcards} />}
    </div>
  );
}
