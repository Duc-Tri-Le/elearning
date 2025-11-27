"use client";
import React, { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";

interface DocxViewerProps {
  link: string;
  zoom?: number;
}

export default function DocxViewer({ link, zoom = 1 }: DocxViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);

  useEffect(() => {
    if (!viewerRef.current) return;

    fetch(link)
      .then((res) => res.blob())
      .then(async (blob) => {
        const container = viewerRef.current!;
        container.innerHTML = ""; // clear nội dung cũ
        await renderAsync(blob, container);

        // Ước lượng số trang
        const paragraphs = container.querySelectorAll("p");
        if (paragraphs.length > 0) {
          const estimatedPages = Math.ceil(paragraphs.length / 40);
          setPageCount(estimatedPages);
        }
      })
      .catch((err) => console.error("Preview error:", err));
  }, [link]);

  return (
    <div
      ref={viewerRef}
      style={{
        height: "80vh",
        overflowY: "auto",
        backgroundColor: "white",
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
        transition: "transform 0.2s ease",
      }}
    />
  );
}
