"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/src/utils/cn";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  isEditing?: boolean;
  layout: string[];
  onLayoutChange: (newLayout: string[]) => void;
  renderBlock: (blockType: string, index: number, isEditing: boolean) => React.ReactNode;
  userCustom?: {
    gap?: string;
    columns?: string;
  };
}

export default function Grid({
  isEditing = false,
  layout,
  onLayoutChange,
  renderBlock,
  userCustom,
  className,
  style,
  ...props
}: GridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    
    const nextLayout = [...layout];
    const [draggedItem] = nextLayout.splice(draggedIndex, 1);
    nextLayout.splice(targetIndex, 0, draggedItem);
    
    onLayoutChange(nextLayout);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const gridVars = {
    "--local-gap": userCustom?.gap || "1.5rem",
  } as React.CSSProperties;

  return (
    <div
      {...props}
      ref={containerRef}
      className={cn(
        "grid w-full transition-all duration-300",
        userCustom?.columns || "grid-cols-2",
        className
      )}
      style={{ gap: "var(--local-gap)", ...gridVars, ...style } as React.CSSProperties}
    >
      {layout.map((blockType, index) => {
        const isDraggingThis = draggedIndex === index;
        const isDragOverThis = dragOverIndex === index;

        return (
          <div
            key={`${blockType}-${index}`}
            draggable={isEditing}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              "relative transition-all duration-200 rounded-xl",
              isDraggingThis && "opacity-30 border border-dashed border-gray-300",
              isDragOverThis &&
                isEditing &&
                "border-2 border-dashed border-[var(--primary-color)] scale-[1.02] bg-[var(--primary-color)]/5"
            )}
          >
            {renderBlock(blockType, index, isEditing)}
            {isEditing && (
              <div className="absolute inset-0 cursor-move z-50 rounded-xl" />
            )}
          </div>
        );
      })}
    </div>
  );
}