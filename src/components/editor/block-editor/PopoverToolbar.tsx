"use client"

import { useEffect, useState } from "react";
import { Bold, Italic, Underline, Strikethrough, Link } from "lucide-react";


//인라인 텍스트용 툴바

interface PopoverToolbarProps {
  onApplyStyle: (styleType: "bold" | "italic" | "underline" | "strikethrough" | "link") => void;
}

export function PopoverToolbar({ onApplyStyle }: PopoverToolbarProps) {
  const [coords, setCoords] = useState({ top: 0, left: 0, show: false });

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection(); // 선택된 텍스트의 범위를 나타내는 Selection 객체 반환(브라우저 내장)
      
      // 드래그가 선택되지 않았거나 범위가 접혀있으면 즉시 숨김
      if (!selection || selection.isCollapsed || selection.toString().trim() === "") {
        setCoords((prev) => ({ ...prev, show: false }));
        return;
      }

      try {
        const range = selection.getRangeAt(0); //현재 선택된 범위 시작점을 Range 객체로 반환
        const rect = range.getBoundingClientRect(); // 드래그블록 좌표 반환

        // 브라우저 뷰포트 스크롤 좌표와 결합하여 툴바 위치 산출
        setCoords({
          top: rect.top + window.scrollY - 48, // 블록 영역 약 48px 위 공중 띄우기
          left: rect.left + window.scrollX + rect.width / 2, // 텍스트 중앙점 정렬
          show: true,
        });
      } catch (e) {
        // Range 오작동 방어 예외 처리
        setCoords((prev) => ({ ...prev, show: false }));
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange); //DOM에 이 함수를 이벤트로 등록
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

  if (!coords.show) return null;

  return (
    <div
      style={{ top: `${coords.top}px`, left: `${coords.left}px`, transform: "translateX(-50%)" }}
      className="absolute z-50 flex items-center gap-0.5 bg-gray-900 border border-gray-800 text-white p-1 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100"
    >
      <button 
        type="button" 
        onClick={() => onApplyStyle("bold")} 
        className="p-1.5 hover:bg-gray-800 rounded transition-colors text-gray-300 hover:text-white"
      >
        <Bold size={15} />
      </button>
      <button 
        type="button" 
        onClick={() => onApplyStyle("italic")} 
        className="p-1.5 hover:bg-gray-800 rounded transition-colors text-gray-300 hover:text-white"
      >
        <Italic size={15} />
      </button>
      <button 
        type="button" 
        onClick={() => onApplyStyle("underline")} 
        className="p-1.5 hover:bg-gray-800 rounded transition-colors text-gray-300 hover:text-white"
      >
        <Underline size={15} />
      </button>
      <button 
        type="button" 
        onClick={() => onApplyStyle("strikethrough")} 
        className="p-1.5 hover:bg-gray-800 rounded transition-colors text-gray-300 hover:text-white"
      >
        <Strikethrough size={15} />
      </button>
      <div className="w-[1px] h-4 bg-gray-700 mx-1" />
      <button 
        type="button" 
        onClick={() => onApplyStyle("link")} 
        className="p-1.5 hover:bg-gray-800 rounded transition-colors text-gray-300 hover:text-white"
      >
        <Link size={15} />
      </button>
    </div>
  );
}
