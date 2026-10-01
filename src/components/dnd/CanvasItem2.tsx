"use client";

import React, { useState } from "react";
import { ItemSchema } from "@/src/types/builder";
import { PrimitiveFactory } from "./PrimitiveFactory";
import { cn } from "@/src/utils/cn";

interface CanvasItemProps {
  item: ItemSchema;
  isEditing?: boolean;
  onSelect?: (id: string, e: React.MouseEvent) => void;
  onDropToContainer?: (targetContainerId: string, e: React.DragEvent) => void;
}

export function CanvasItem({
  item,
  isEditing = false,
  onSelect,
  onDropToContainer,
}: CanvasItemProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const isContainer = item.type === "container";

  // 컨테이너일 때만 작동하는 DnD 드롭존 이벤트
  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditing || !isContainer) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (!isEditing || !isContainer) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isEditing || !isContainer) return;
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isEditing || !isContainer) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    onDropToContainer?.(item.id, e);
  };

  return (
    <div
      data-component-id={item.id} // SelectionOverlay가 추적할 DOM 마커
      draggable={isEditing}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={(e) => {
        if (isEditing) {
          e.stopPropagation();
          onSelect?.(item.id, e);
        }
      }}
      className={cn(
        "canvas-item relative",
        isEditing && isContainer && isDragOver && "bg-blue-500/10 ring-2 ring-dashed ring-blue-400"
      )}
    >
      <PrimitiveFactory item={item} isEditing={isEditing} />
    </div>
  );
}