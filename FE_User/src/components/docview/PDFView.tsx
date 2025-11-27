"use client";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default function PDFViewer({ link, zoom = 1 }: { link: string; zoom?: number }) {
  const [numPages, setNumPages] = useState<number>(0);

  return (
    <div
      className="flex flex-col items-center w-full overflow-y-auto"
      style={{
        backgroundColor: "#7f7f7f", // nền ngoài
        padding: "40px 0",
        height: "80vh",
      }}
    >
      <Document
        file={link}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(e) => console.error("PDF load error:", e)}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div
            key={`page_${index + 1}`}
            style={{
              backgroundColor: "white",
              boxShadow: "4px 4px 4px rgba(0,0,0,0.15)",
              marginBottom: "24px", // 🟢 khoảng cách giữa các trang
              borderRadius: "4px",
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease",
            }}
          >
            <Page
              pageNumber={index + 1}
              width={800}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
