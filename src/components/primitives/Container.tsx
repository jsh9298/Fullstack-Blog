"use client";

import React, { useState, useRef, CSSProperties } from "react";
import { BasePrimitiveProps } from "@/src/types/builder";
import { useLocalVar } from "@/src/utils/style";
import { cn } from "@/src/utils/cn";
import { PrimitiveBase } from "./PrimitiveBase";

export interface ContainerProps extends BasePrimitiveProps{
  layoutMode? : "flex" | "grid";
  asTag? : "div" | "section" | "article" | "main" | "aside";
  children? : React.ReactNode;
}
type FlexDirection = React.CSSProperties["flexDirection"];
type Display = React.CSSProperties["display"];

export function Container({
  layoutMode = "flex",
  asTag = "div",
  isEditing,
  children,
  className,
  ...baseProps
}: ContainerProps) {
  // LocalVars에서 스타일 추출 (Fallback 값 포함)
  const display = useLocalVar("display", layoutMode) as Display;
  const flexDirection =  display === "flex" ? useLocalVar("flexDirection", "column") as FlexDirection  : undefined; 
  const gridTemplateColumns = display === "grid" ? useLocalVar("gridTemplateColumns", "repeat(2, 1fr)")  : undefined;

  return (
    <PrimitiveBase {...baseProps} isEditing={isEditing} as={asTag}>
      <div
        style={{
          display : useLocalVar("display", layoutMode),
          flexDirection : flexDirection,
          gridTemplateColumns : gridTemplateColumns,
          gap : useLocalVar("gap", "16px"),
          padding : useLocalVar("padding", "16px"),
          backgroundColor : useLocalVar("bg", "transparent"),
          borderRadius : useLocalVar("radius", "0px"),
          borderWidth : useLocalVar("borderWidth", "0px"),
          borderStyle : useLocalVar("borderStyle", "solid"),
          borderColor : useLocalVar("borderColor", "transparent"),
          boxShadow : useLocalVar("shadow", "none"),
        }}
        className={cn("relative min-h-15 w-full transition-all", isEditing && "outline-1 outline-dashed outline-gray-300", className)}
      >
        {children}
      </div>
    </PrimitiveBase>
  );
}



import { ItemSchema } from "@/src/types/builder";

export const CONTAINER_PRESETS = {
  // 1. 기본 빈 컨테이너 (Flex 수직)
  box: (id: string): ItemSchema => ({
    id,
    type: "container",
    props: { layoutMode: "flex", asTag: "div" },
    localVars: {
      width: "100%",
      padding: "16px",
      gap: "12px",
      display: "flex",
      flexDirection: "column",
    },
  }),

  // 2. 카드(Card) 프리셋
  card: (id: string): ItemSchema => ({
    id,
    type: "container",
    props: { layoutMode: "flex", asTag: "div" },
    localVars: {
      width: "100%",
      padding: "24px",
      gap: "16px",
      bg: "#ffffff",
      radius: "12px",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#e5e7eb",
      shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
    },
  }),

  // 3. 그리드 2열(Grid 2Col) 프리셋
  grid2Col: (id: string): ItemSchema => ({
    id,
    type: "container",
    props: { layoutMode: "grid", asTag: "div" },
    localVars: {
      width: "100%",
      padding: "16px",
      gap: "16px",
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  }),

  // 4. 랜딩페이지 섹션(Section) 프리셋
  section: (id: string): ItemSchema => ({
    id,
    type: "container",
    props: { layoutMode: "flex", asTag: "section" },
    localVars: {
      width: "100%",
      padding: "64px 24px",
      gap: "24px",
      bg: "#f9fafb",
      display: "flex",
      flexDirection: "column",
    },
  }),
};