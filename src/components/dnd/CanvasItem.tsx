"use client";

import React from "react";
import { useScopedCss } from "@/src/hooks/useScopedCss";

export interface ItemData {
  id: string;
  label: string;
  type: "button" | "input" | "range"; //원시타입 추가 할때마다 추가해주면됨.
  props: Record<string, any>;
  customCss?: string;
  localVars?: Record<string, string>;
}

interface CanvasItemProps {
  item: ItemData;
  isEditing: boolean;
  isSelected:boolean;
  onSelect:(id:string) => void;
  dragProps?: React.HTMLAttributes<HTMLDivElement>;
  dropProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
  isDragOver?: boolean;
}

export function CanvasItem({
  item,
  isEditing,
  isSelected,
  onSelect,
  dragProps,
  dropProps,
  isDragging,
  isDragOver,
}: CanvasItemProps) {
  const { scopeAttributeName, scopeAttributeValue, sanitizedCss, isValid, errorMessage } =
    useScopedCss({
      componentId: item.id,
      customCss: item.customCss,
    });

  // 로컬 CSS 변수를 style 객체로 매핑
  const styleWithVars = {
    ...item.localVars,
  } as React.CSSProperties;  

  return (
    <div
      {...dragProps}
      {...dropProps}
      data-component-id={item.id} // 오버레이 추적용 식별자
      onClick={(e) =>{
        e.stopPropagation();
        onSelect(item.id);
      }} // 선택 처리
      // style={{
      //     width: item.localVars?.["--local-width"] || "auto",
      //     height: item.localVars?.["--local-height"] || "auto",
      //     padding: item.localVars?.["--local-padding"] || "8px",
      //   }}
      className={
        //`relative p-4 mb-3 border-2 rounded-lg transition-all 
        `relative p-3 mb-3 rounded-lg border-2 transition-all select-none
        ${
        // isDragging ? "opacity-40 scale-95 border-dashed border-gray-400" : "opacity-100"
        isDragging ? "opacity-30 border-dashed border-gray-400" : "opacity-100"
        } ${
          //isDragOver ? "border-blue-500 bg-blue-50/50 scale-[1.01]" : "border-gray-200 bg-white"}`
        isDragOver ? "border-blue-500 bg-blue-50/40" : "border-transparent"}`
      }
    >
      {/* 1. 스코핑된 사용자 정의 CSS 주입 */}
      {isValid && sanitizedCss && (
        <style dangerouslySetInnerHTML={{ __html: sanitizedCss }} />
      )}

      {/* 2. CSS 검증 에러 메시지 노출 */}
      {isEditing && !isValid && (
        <div className="text-xs text-red-500 bg-red-50 p-1 mb-2 rounded border border-red-200">
          ⚠️ {errorMessage}
        </div>
      )}
          {/* 3. 실제 원시 컴포넌트 노드 영역 */}
          <div
            {...{ [scopeAttributeName]: scopeAttributeValue }}
            style={styleWithVars}
            className="flex flex-col gap-2"
          >
            {/* <span className="text-xs font-semibold text-gray-500 select-none">
              {item.label} ({item.type})
            </span> */}

            {item.type === "button" && (
              <button
                type="button"
                tabIndex={isEditing ? -1 : 0}
                className="custom-btn px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                클릭하세요
              </button>
            )}

            {item.type === "input" && (
              <input
                type="text"
                readOnly={isEditing}
                tabIndex={isEditing ? -1 : 0}
                placeholder="텍스트를 입력하세요"
                className="custom-input border p-2 rounded w-full"
              />
            )}

            {item.type === "range" && (
              <input
                type="range"
                readOnly={isEditing}
                tabIndex={isEditing ? -1 : 0}
                className="custom-slider w-full"
              />
            )}
          </div>

      {/* 4. [Editing Guard Layer] 에디팅 모드 시 상단에 투명 가드 투입하여 원시 포커스/이벤트 차단 */}
      {isEditing && (
        <div
          className="absolute inset-0 z-50 cursor-move bg-transparent"
          title="클릭하여 선택/드래그하여 순서 변경"
        />
      )}
    </div>
  );
}