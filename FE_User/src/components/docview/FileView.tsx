"use client";
import React, { useState } from "react";
import DocxViewer from "./DocView";
import PDFViewer from "./PDFView";
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RefreshCw, Download } from "lucide-react";

interface FileViewerProps {
  link: string;
}

export default function FileViewer({ link }: FileViewerProps) {
  const ext = link.split(".").pop()?.toLowerCase();
  const [zoom, setZoom] = useState(1);
  const [isFull, setIsFull] = useState(false);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const resetZoom = () => setZoom(1);

  const toggleFull = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
    setIsFull(!isFull);
  };

  const downloadFile = () => {
    const a = document.createElement("a");
    a.href = link;
    a.download = link.split("/").pop() || "file";
    a.click();
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-gray-100">
      {/* Toolbar */}
      <div className="flex justify-between items-center bg-gray-800 text-white p-2">
        <span>📄 Xem tài liệu ({ext?.toUpperCase()})</span>
        <div className="flex gap-3 items-center">
          <button onClick={zoomOut}><ZoomOut size={18} /></button>
          <button onClick={zoomIn}><ZoomIn size={18} /></button>
          <button onClick={resetZoom}><RefreshCw size={18} /></button>
          <button onClick={downloadFile}><Download size={18} /></button>
          <button onClick={toggleFull}>
            {isFull ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ background: "#7f7f7f", height: "80vh", overflow: "auto" }}>
        {ext === "pdf" && <PDFViewer link={link} zoom={zoom} />}
        {ext === "docx" && <DocxViewer link={link} />}
        {!["pdf", "docx"].includes(ext || "") && (
          <div className="p-4 text-center text-gray-600">
            ❌ Không hỗ trợ định dạng: <b>{ext}</b>
          </div>
        )}
      </div>
    </div>
  );
}
