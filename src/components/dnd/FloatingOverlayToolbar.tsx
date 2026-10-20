"use client";

import React, { useEffect, useState } from "react";

interface FloatingOverlayToolbarProps {
  selectedId: string | null;
  selectedItem: any | null; // 현재 선택된 CanvasItem 데이터
  parentId: string | null;  // 현재 선택된 아이템의 부모 ID
  onSelectParent: (parentId: string) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
}

export function FloatingOverlayToolbar({
  selectedId,
  selectedItem,
  parentId,
  onSelectParent,
  onDuplicate,
  onRemove,
}: FloatingOverlayToolbarProps) {
  const [coords, setCoords] = useState<{ top: number; left: number; width: number;bottom:number; } | null>(null);

  // 선택된 아이템의 DOM 위치를 추적하여 툴바 좌표 계산
  useEffect(() => {
    if (!selectedId) {
      setCoords(null);
      return;
    }

    const updatePosition = () => {
      const element = document.querySelector(`[data-item-id="${selectedId}"]`) as HTMLElement;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      // 스크롤 위치 감안
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        bottom: rect.bottom - window.scrollY
      });
    };

    updatePosition();

    // 윈도우 스크롤이나 리사이즈 시 위치 동기화
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [selectedId, selectedItem]);

  if (!selectedId || !coords) return null;

  return (
    <div
      style={{
        top: `${Math.max(coords.bottom - 42, 10)}px`,
        left: `${coords.left + coords.width / 2}px`,
        transform: "translateX(-50%)",
      }}
      className="absolute z-50 flex items-center gap-1 bg-gray-900 text-white px-2.5 py-1 rounded-md shadow-xl text-xs font-medium pointer-events-auto transition-all duration-75"
      onClick={(e) => e.stopPropagation()} // 툴바 클릭 시 캔버스 선택 해제 방지
    >
      {/* 1. 컴포넌트 타입 뱃지 */}
      <span className="text-[10px] text-blue-400 font-bold uppercase px-1">
        {selectedItem?.type || "Item"}
      </span>

      <div className="w-px h-3 bg-gray-700 mx-0.5" />

      {/* 2. 상위 부모로 이동 버튼 (부모가 있을 때만 활성화) */}
      <button
        type="button"
        disabled={!parentId}
        onClick={() => parentId && onSelectParent(parentId)}
        className={`px-1.5 py-0.5 rounded hover:bg-gray-800 transition-colors flex items-center gap-1 ${
          !parentId ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
        }`}
        title="상위 컨테이너 선택"
      >
        <span>↑ 부모</span>
      </button>

      {/* 3. 복제 버튼 */}
      <button
        type="button"
        onClick={() => onDuplicate(selectedId)}
        className="px-1.5 py-0.5 rounded hover:bg-gray-800 cursor-pointer transition-colors"
        title="컴포넌트 복제"
      >
        복제
      </button>

      {/* 4. 삭제 버튼 */}
      <button
        type="button"
        onClick={(e) => onRemove(selectedId)}
        className="px-1.5 py-0.5 rounded hover:bg-red-600 text-red-400 hover:text-white cursor-pointer transition-colors"
        title="삭제 (Del)"
      >
        삭제
      </button>
    </div>
  );
}