"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface SelectionOverlayProps {
  selectedId: string | null;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onUpdateStyle: (id: string, newStyles: Record<string, string>) => void;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function SelectionOverlay({
  selectedId,
  canvasRef,
  onUpdateStyle,
}: SelectionOverlayProps) {
  const [rect, setRect] = useState<Rect | null>(null);
  const isResizing = useRef(false);

  // 1. 선택된 타겟 DOM의 위치 및 크기 추적
  const updateRect = useCallback(() => {
    if (!selectedId || !canvasRef.current) {
      setRect(null);
      return;
    }

    // data-component-id 속성으로 타겟 DOM 검색
    const targetEl = canvasRef.current.querySelector(
      `[data-component-id="${selectedId}"]`
    ) as HTMLElement;

    if (!targetEl) {
      setRect(null);
      return;
    }

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    // 캔버스 상대 좌표 계산
    setRect({
      top: targetRect.top - canvasRect.top,
      left: targetRect.left - canvasRect.left,
      width: targetRect.width,
      height: targetRect.height,
    });
  }, [selectedId, canvasRef]);

  // DOM 변형 및 창 크기 변경 시 오버레이 위치 재계산
  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [updateRect]);

  // 2. 리사이즈 핸들 드래그 이벤트 처리 (우측 하단 SE 핸들 예시)
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!selectedId || !rect) return;

    isResizing.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = rect.width;
    const startHeight = rect.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.current) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes("e")) newWidth = Math.max(30, startWidth + deltaX);
      if (direction.includes("s")) newHeight = Math.max(20, startHeight + deltaY);

      // 로컬 CSS 변수 형태나 px 스타일 업데이트
      onUpdateStyle(selectedId, {
        "--local-width": `${Math.round(newWidth)}px`,
        "--local-height": `${Math.round(newHeight)}px`,
      });

      // 즉시 오버레이 위치 반영
      setRect((prev) => prev ? { ...prev, width: newWidth, height: newHeight } : null);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  if (!rect || !selectedId) return null;

  return (
    <div
      className="absolute pointer-events-none border-2 border-blue-500 z-50 transition-all duration-75"
      style={{
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }}
    >
      {/* 컴포넌트 라벨 & 크기 배지 */}
      <div className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-t font-mono select-none whitespace-nowrap">
        {Math.round(rect.width)}px × {Math.round(rect.height)}px
      </div>

      {/* 8방향 리사이즈 핸들 노드 (pointer-events-auto 부여로 클릭/드래그 활성화) */}
      {/* 동(East - 너비 조절) */}
      <div
        onMouseDown={(e) => handleResizeStart(e, "e")}
        className="pointer-events-auto absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-e-resize hover:scale-125 transition-transform"
      />

      {/* 남(South - 높이 조절) */}
      <div
        onMouseDown={(e) => handleResizeStart(e, "s")}
        className="pointer-events-auto absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-blue-500 rounded-full cursor-s-resize hover:scale-125 transition-transform"
      />

      {/* 남동(South-East - 동시 조절) */}
      <div
        onMouseDown={(e) => handleResizeStart(e, "se")}
        className="pointer-events-auto absolute -right-1.5 -bottom-1.5 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-sm cursor-se-resize hover:scale-125 transition-transform"
      />

      {/* 패딩/간격 조절 Quick Bar (컴포넌트 내부 여백 조절용 인라인 핸들) */}
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          // 패딩 전용 조절 마우스 이벤트 바인딩 로직
        }}
        className="pointer-events-auto absolute top-2 right-2 px-1 bg-amber-400 text-[9px] font-bold text-gray-800 rounded cursor-ew-resize opacity-80 hover:opacity-100"
        title="드래그하여 내부 패딩 조절"
      >
        PADDING
      </div>
    </div>
  );
}