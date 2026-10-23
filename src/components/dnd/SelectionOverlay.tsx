"use client";

import React, { useEffect, useRef, useState } from "react";
import { FloatingOverlayToolbar } from "./FloatingOverlayToolbar";

interface SelectionOverlayProps {
  selectedId: string | null;
  selectedItem: any;
  parentId: string | null;
  onSelectParent: (parentId: string) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateLocalVars: (id: string, localVars: Record<string, any>) => void;
}

export function SelectionOverlay({
  selectedId,
  selectedItem,
  parentId,
  onSelectParent,
  onDuplicate,
  onRemove,
  onUpdateLocalVars
}: SelectionOverlayProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const isDraggingRef = useRef<"resize" | "rotate" | null>(null);
  const startPosRef = useRef<{ x: number; y: number; width: number; height: number; rotate: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotate: 0,
  });
  // 선택된 아이템의 DOM 위치 실시간 추적
  useEffect(() => {
    if (!selectedId) {
      setRect(null);
      return;
    }
    let animationFrameId: number;
    const updateRect = () => {
      if (isDraggingRef.current) {
        animationFrameId = requestAnimationFrame(updateRect);
        return;
      }
      const el = document.querySelector(`[data-item-id="${selectedId}"]`);
      if (el) {
        const rect : DOMRect = el.getBoundingClientRect();
        const newRect = DOMRect.fromRect({
            ...rect,
            y: rect.top + window.scrollY,
            x: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height,
          }
        )
        setRect(newRect);
      }
      animationFrameId = requestAnimationFrame(updateRect);
    };

    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [selectedId, selectedItem]);

  // ───────── 크기 조절(Resize) 시작 ─────────
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!rect) return;

    isDraggingRef.current = "resize";
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
      rotate: 0,
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // ───────── 회전(Rotate) 시작 ─────────
  const handleRotateStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!rect) return;

    isDraggingRef.current = "rotate";
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 현재 마우스와 박스 중심점 간의 각도 계산
    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const existingRotate = parseInt(selectedItem?.localVars?.rotate || "0", 10);

    startPosRef.current = {
      x: centerX,
      y: centerY,
      width: 0,
      height: 0,
      rotate: existingRotate - currentAngle,
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // ───────── 드래그 중 계산 및 반영 ─────────
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !selectedId) return;

    if (isDraggingRef.current === "resize") {
      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;
      const newWidth = Math.max(50, startPosRef.current.width + dx);
      const newHeight = Math.max(30, startPosRef.current.height + dy);
      
      setRect((prev) => (prev ? { ...prev, width: newWidth, height: newHeight } : null));

      // 실시간 localVars 업데이트 (width, height)
      onUpdateLocalVars(selectedId, {
        ...selectedItem?.localVars,
        width: `${Math.round(newWidth)}px`,
        height: `${Math.round(newHeight)}px`,
      });
    } else if (isDraggingRef.current === "rotate") {
      const centerX = rect? rect.left+rect.width/2:0 //startPosRef.current.x;
      const centerY = rect? rect.top+rect.height/2:0 //startPosRef.current.y;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      const finalRotate = Math.round(angle + startPosRef.current.rotate);

      // 실시간 localVars 업데이트 (rotate)
      onUpdateLocalVars(selectedId, {
        ...selectedItem?.localVars,
        rotate: `${finalRotate}deg`,
      });
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  if (!selectedId || !rect) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {/* 1. 선택된 컴포넌트를 감싸는 파란색 아웃라인 박스 */}
      <div
        style={{
          top: `${rect.top + window.scrollY}px`,
          left: `${rect.left + window.scrollX}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          transform: selectedItem?.localVars?.rotate ? `rotate(${selectedItem.localVars.rotate})` : undefined,
          transformOrigin: "center center",
        }}
        className="absolute border-2 border-blue-500 bg-blue-500/5 pointer-events-none rounded transition-none"
      >
        <div
          onMouseDown={handleRotateStart}
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-grab active:cursor-grabbing pointer-events-auto shadow flex items-center justify-center text-[9px] text-blue-600 font-bold"
          title="드래그하여 회전"
        >
          ↻
        </div>
        {/* 모서리 리사이즈 핸들 (추후 크기 조절 고도화 시 활용) */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-blue-500 rounded-full" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-blue-500 rounded-full" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-blue-500 rounded-full" />
        <div
          onMouseDown={handleResizeStart}
          className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-se-resize pointer-events-auto shadow"
          title="드래그하여 크기 조절"
        />
      </div>

      {/* 2. 바로 위에 붙는 퀵 오버레이 툴바 */}
      <FloatingOverlayToolbar
        selectedId={selectedId}
        selectedItem={selectedItem}
        parentId={parentId}
        onSelectParent={onSelectParent}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
      />
    </div>
  );
}