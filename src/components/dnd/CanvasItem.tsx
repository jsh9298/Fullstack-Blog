"use client";

import React, { useState } from "react";
import { ItemSchema } from "@/src/types/builder";
import { PrimitiveFactory } from "./PrimitiveFactory";
import { cn } from "@/src/utils/cn";

interface CanvasItemProps {
  item: ItemSchema;
  selectedId: string | null;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onRemove:(id:string, e: React.MouseEvent) => void;
  onDropToContainer: ( e: React.DragEvent,targetContainerId: string) => void;
  onCanvasDragStart: (e: React.DragEvent, id: string) => void;
}

export function CanvasItem({
  item,
  selectedId,
  onSelect,
  onRemove,
  onDropToContainer,
  onCanvasDragStart
}: CanvasItemProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const isContainer = item.type === "container";
  const isSelected = item.id === selectedId;

  if(isContainer){
    return (
      <div
        draggable
        onDragStart={(e) => onCanvasDragStart(e, item.id)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.id,e);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation(); // 부모 컨테이너로 이벤트 전파 차단
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.stopPropagation();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.stopPropagation(); // 부모 컨테이너로 드롭 이벤트 전파 차단
          setIsDragOver(false);
          onDropToContainer(e,item.id);
        }}
        className={`relative p-4 rounded-lg transition-all border-2 my-1 ${
          isDragOver
            ? "border-blue-500 bg-blue-50/30"
            : isSelected
            ? "border-blue-500 bg-white ring-2 ring-blue-100"
            : "border-gray-300 border-dashed bg-gray-50/50 hover:border-gray-400"
        }`}
      >
        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2 pointer-events-none">
          Container ({item.id})
        </span>
        <div className="min-h-[50px] flex flex-col gap-2">
          {item.children && item.children.length > 0 ? (
            item.children.map((child) => (
              <CanvasItem
                key={child.id}
                item={child}
                selectedId={selectedId}
                onSelect={onSelect}
                onRemove={onRemove}
                onDropToContainer={onDropToContainer}
                onCanvasDragStart={onCanvasDragStart}
              />
            ))
          ) : (
            <div className="h-12 flex items-center justify-center text-xs text-gray-400 pointer-events-none">
              여기에 요소를 드롭하세요 (Nested DropZone)
            </div>
          )}
        </div>
        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id,e);
            }}
            className="absolute -top-2.5 -right-2.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow z-10"
          >
            ✕
          </button>
        )}
      </div>
      
    );
  } else{

    // 2. 일반 원시 컴포넌트일 때
    return (
      <div
        draggable
        onDragStart={(e) => onCanvasDragStart(e, item.id)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.id,e);
        }}
        className={`relative p-1 rounded transition-all border-2 my-0.5 cursor-pointer ${
          isSelected
            ? "border-blue-500 ring-2 ring-blue-100"
            : "border-transparent hover:border-gray-200"
        }`}
      >
        {PrimitiveFactory({item} )}

        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id,e);
            }}
            className="absolute -top-2.5 -right-2.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow z-10"
          >
            ✕
          </button>
        )}
      </div>
    );
  }
}