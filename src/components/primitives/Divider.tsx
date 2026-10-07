"use client";

import React from "react";
import { PrimitiveBase } from "./PrimitiveBase";
import { BasePrimitiveProps } from "@/src/types/builder"; 
import { useLocalVar } from "@/src/utils/style"; 
import { cn } from "@/src/utils/cn"; 

export interface DividerProps extends BasePrimitiveProps {
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  orientation = "horizontal",
  isEditing = false,
  className,
  ...baseProps
}: DividerProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <PrimitiveBase {...baseProps} isEditing={isEditing}>
      <hr
        style={{
          width: isHorizontal ? useLocalVar("width", "100%") : useLocalVar("borderWidth", "1px"),
          height: isHorizontal ? useLocalVar("borderWidth", "1px") : useLocalVar("height", "100%"),
          backgroundColor: useLocalVar("borderColor", "#e5e7eb"),
          marginTop: useLocalVar("marginTop", "16px"),
          marginBottom: useLocalVar("marginBottom", "16px"),
          border: "none", // 기본 hr 테두리 제거 후 custom height/bg로 제어
        }}
        className={cn(
          "shrink-0 transition-all",
          isHorizontal ? "w-full my-4" : "h-full mx-4 inline-block",
          className
        )}
      />
    </PrimitiveBase>
  );
}