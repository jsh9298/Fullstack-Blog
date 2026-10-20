"use client";

import React, { useState } from "react";
import { ItemSchema } from "@/src/types/builder";
import { PrimitiveFactory } from "./PrimitiveFactory";
import { cn } from "@/src/utils/cn";
import { convertLocalVarsToCssVars, useLocalVar } from "@/src/utils/style";

interface CanvasItemProps {
  item: ItemSchema;
  itemIndex: number;
  parentId:string | null
  selectedId: string | null;
  parentFlexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  onSelect: (id: string, e: React.MouseEvent) => void;
  onRemove:(id:string, e: React.MouseEvent) => void;
  onDropWithPosition: ( e: React.DragEvent, targetParentId: string | null, targetIndex: number) => void;
  onCanvasDragStart: (e: React.DragEvent, id: string) => void;
}

type DropPosition = "top" | "bottom" | "left" | "right" | "inside" | null;

export function CanvasItem({
  item,
  selectedId,
  itemIndex,
  parentId,
  parentFlexDirection = "column",
  onSelect,
  onRemove,
  onCanvasDragStart,
  onDropWithPosition
}: CanvasItemProps) {
  const isContainer = item.type === "container";
  const isSelected = item.id === selectedId;
  const [dropPosition, setDropPosition] = useState<DropPosition>(null);
  const isRowLayout = parentFlexDirection.startsWith("row");
  const currentContainerFlexDir = item.localVars?.flexDirection || parentFlexDirection || "column";
  const handleDragOver = (e:React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    if(isRowLayout){
      //좌우 배치 일경우
      const offsetX = e.clientX - rect.left;
      const width = rect.width;
      if (item.type === "container") {
        if (offsetX < width * 0.2) setDropPosition("left");
        else if (offsetX > width * 0.8) setDropPosition("right");
        else setDropPosition("inside");
      } else {
        if (offsetX < width * 0.5) setDropPosition("left");
        else setDropPosition("right");
      }
    }else {
      // ───────── 상하 배치(Flex-Column) 일 때: 마우스 Y축 기준 계산 ─────────
      const offsetY = e.clientY - rect.top;
      const height = rect.height;
      if (item.type === "container") {
        // 컨테이너일 경우: 상단 20% -> top, 하단 20% -> bottom, 중앙 -> inside
        if (offsetY < height * 0.2) setDropPosition("top");
        else if (offsetY > height * 0.8) setDropPosition("bottom");
        else setDropPosition("inside");
      } else {
        // 일반 컴포넌트일 경우: 위 50% -> top, 아래 50% -> bottom
        if (offsetY < height * 0.5) setDropPosition("top");
        else setDropPosition("bottom");
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setDropPosition(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const finalPos = dropPosition;
    setDropPosition(null);

    if (finalPos === "inside" && item.type === "container") {
      // 컨테이너 내부 맨 뒤에 삽입
      onDropWithPosition(e, item.id, item.children?.length || 0);
    } else if (finalPos === "top"|| finalPos === "left") {
      // 해당 아이템 바로 위에 삽입
      onDropWithPosition(e, parentId, itemIndex);
    } else if (finalPos === "bottom"|| finalPos === "right") {
      // 해당 아이템 바로 아래에 삽입
      onDropWithPosition(e, parentId, itemIndex + 1);
    }
  };



    return (
      <div className={cn("relative group", isRowLayout && "inline-block h-full")}>
        {/* 1. 상단 삽입 가이드선 Indicator */}
        {dropPosition === "top" && (
          <div className="absolute -top-1 left-0 right-0 h-1 bg-blue-500 rounded-full z-20 pointer-events-none" />
        )}
        {/* 좌측(Left) 삽입 가이드선 (세로 파란선) */}
        {dropPosition === "left" && (
          <div className="absolute -left-1 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-20 pointer-events-none" />
        )}

        {isContainer ? (
            <div
              draggable
              onDragStart={
                (e) => onCanvasDragStart(e, item.id)
              }
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item.id,e);
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                ...convertLocalVarsToCssVars(item.localVars),
                display: useLocalVar("display", "flex"),
                flexDirection: useLocalVar("flexDirection", "column") as any,
                gap: useLocalVar("gap", "12px"),
                padding: useLocalVar("padding", "16px"),
                backgroundColor: useLocalVar("bg", "#ffffff"),
                width: item.localVars?.width || "auto",
                height: item.localVars?.height || "auto",
                transform: item.localVars?.rotate ? `rotate(${item.localVars.rotate})` : undefined
              }}
              className={cn(
                "relative rounded-lg transition-all border-2 my-1 min-h-20 w-full",
                dropPosition === "inside"
                  ? "border-blue-500 bg-blue-50/40"
                  // : isSelected
                  // ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-gray-300 border-dashed hover:border-gray-400"
              )}
              data-item-id={item.id}
            >
              
              <div
                className={cn(
                  "w-full h-full min-h-12.5 flex",
                  currentContainerFlexDir === "row" ? "flex-row items-center" : "flex-col"
                )}
              >
                {/* 자식 재귀 렌더링 영역 (flexDirection 스타일에 따라 즉시 정렬 바뀜) */}
                {item.children && item.children.length > 0 ? (
                    item.children.map((child,idx) => (
                      <CanvasItem
                        key={child.id}
                        item={child}
                        selectedId={selectedId}
                        onSelect={onSelect}
                        onRemove={onRemove}
                        onCanvasDragStart={onCanvasDragStart}
                        itemIndex={idx}
                        parentId={item.id} 
                        onDropWithPosition={onDropWithPosition} 
                        parentFlexDirection={currentContainerFlexDir}
                      />
                    )
                  )
                ) : (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2 pointer-events-none select-none">
                        Container ({item.id + currentContainerFlexDir})
                      </span>
                      <div className="h-12 flex items-center justify-center text-xs text-gray-400 pointer-events-none">
                        여기에 요소를 드롭하세요 (Nested DropZone)
                      </div>
                    </div>
                  )}
              </div>
            </div>
            ):(
              <div
                  draggable
                  onDragStart={(e) => onCanvasDragStart(e, item.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.id,e);
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  data-item-id={item.id}
                  style={{
                    ...convertLocalVarsToCssVars(item.localVars), 
                    width: item.localVars?.width || "auto",
                    height: item.localVars?.height || "auto",
                    transform: item.localVars?.rotate ? `rotate(${item.localVars.rotate})` : undefined
                  }}
                  className={cn(
                    "relative p-1 rounded transition-all border-2 my-0.5 cursor-pointer",
                    // isSelected
                    //   ? "border-blue-500 ring-2 ring-blue-100"
                    //   : "border-transparent hover:border-gray-200"
                  )}
                >
                  {PrimitiveFactory({item})}
                </div>
            )
        }

        {/* 하단(Bottom) 삽입 가이드선 (가로 파란선) */}
        {dropPosition === "bottom" && (
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-blue-500 rounded-full z-20 pointer-events-none" />
        )}
        {/* 우측(Right) 삽입 가이드선 (세로 파란선) */}
        {dropPosition === "right" && (
          <div className="absolute -right-1 top-0 bottom-0 w-1 bg-blue-500 rounded-full z-20 pointer-events-none" />
        )}
      </div>
    );
}