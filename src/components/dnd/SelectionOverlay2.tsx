"use client";

import React, { useEffect, useState } from "react";

interface SelectionOverlayProps {
  selectedId: string | null;
  onDelete?: (id: string) => void;
}

export function SelectionOverlay({ selectedId, onDelete }: SelectionOverlayProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!selectedId) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      // data-component-id 속성을 가진 DOM 요소를 추적
      const element = document.querySelector(`[data-component-id="${selectedId}"]`);
      if (element) {
        setRect(element.getBoundingClientRect());
      }
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [selectedId]);

  if (!selectedId || !rect) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        pointerEvents: "none", // 클릭 이벤트를 뚫고 아래 캔버스로 전달
      }}
      className="z-50 border-2 border-blue-500 transition-all duration-75"
    >
      {/* 컴포넌트 태그 라벨 & 삭제 버튼 */}
      <div className="absolute -top-6 left-0 flex items-center gap-1 bg-blue-500 px-2 py-0.5 text-[11px] text-white rounded-t pointer-events-auto">
        <span>{selectedId}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(selectedId);
          }}
          className="ml-1 hover:text-red-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}