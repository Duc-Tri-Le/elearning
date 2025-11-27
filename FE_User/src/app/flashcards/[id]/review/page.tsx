"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shuffle, ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./FlashcardReview.module.css";

const FlashcardApp = () => {
    const cards = [
        { front: "Understanding", back: "Sự hiểu biết" },
        { front: "Knowledge", back: "Kiến thức" },
        { front: "Wisdom", back: "Trí tuệ" },
        { front: "Learning", back: "Học tập" },
    ];

    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [deck, setDeck] = useState(cards);

    const nextCard = () => {
        setFlipped(false);
        setIndex((prev) => (prev + 1) % deck.length);
    };

    const prevCard = () => {
        setFlipped(false);
        setIndex((prev) => (prev - 1 + deck.length) % deck.length);
    };

    const shuffleDeck = () => {
        const newDeck = [...deck].sort(() => Math.random() - 0.5);
        setDeck(newDeck);
        setIndex(0);
        setFlipped(false);
    };

    return (
        <div className={styles.container}>
            <motion.div className={styles.card} onClick={() => setFlipped(!flipped)}>
                <motion.div
                    className={`${styles.cardInner} ${flipped ? styles.flipped : ""}`}
                    transition={{ duration: 0.6 }}
                >
                    <div className={`${styles.cardContent} ${styles.front}`}>
                        {deck[index].front}
                    </div>
                    <div className={`${styles.cardContent} ${styles.back}`}>
                        {deck[index].back}
                    </div>
                </motion.div>
            </motion.div>

            <div className={styles.controls}>
                <button onClick={prevCard} className={styles.button}>
                    <ArrowLeft />
                </button>
                <button onClick={shuffleDeck} className={styles.button}>
                    <Shuffle />
                </button>
                <button onClick={nextCard} className={styles.button}>
                    <ArrowRight />
                </button>
            </div>

            <p className={styles.counter}>
                Thẻ {index + 1} / {deck.length}
            </p>
        </div>
    );
};

export default FlashcardApp;
