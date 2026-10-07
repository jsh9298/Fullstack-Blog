"use client";

import { PrimitiveBase } from "./PrimitiveBase";
import { BasePrimitiveProps } from "@/src/types/builder";
import { useLocalVar } from "@/src/utils/style";
import { cn } from "@/src/utils/cn";


export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps extends BasePrimitiveProps {
  content?: string;
  level?:HeadingLevel;
  isInlineEditing?: boolean;
  onContentChange?: (newContent: string) => void;
}

const DEFAULT_LEVEL_STYLES: Record<HeadingLevel, { fontSize: string; fontWeight: string; marginBottom: string }> = {
  h1: { fontSize: "36px", fontWeight: "800", marginBottom: "16px" },
  h2: { fontSize: "30px", fontWeight: "700", marginBottom: "14px" },
  h3: { fontSize: "24px", fontWeight: "600", marginBottom: "12px" },
  h4: { fontSize: "20px", fontWeight: "600", marginBottom: "10px" },
  h5: { fontSize: "18px", fontWeight: "600", marginBottom: "8px" },
  h6: { fontSize: "16px", fontWeight: "600", marginBottom: "8px" },
};

export function Heading({
  content =  "본문 텍스트를 입력하세요.",
  isEditing = false,
  isInlineEditing = false,
  level = "h1",
  onContentChange,
  className,
  ...props
}: HeadingProps) {
  const handleChange = (e: React.FocusEvent<HTMLHeadingElement>) => {
    if (!isInlineEditing) {
      onContentChange?.(e.target.textContent || "");
    }
  };

  const HeaderTag = level;
  const defaultStyle = DEFAULT_LEVEL_STYLES[level];

  return (
    <PrimitiveBase {...props} isEditing={isEditing}>
        <HeaderTag
            contentEditable={isInlineEditing}
            suppressContentEditableWarning
            onBlur={handleChange}
            style={{
              width: useLocalVar("width", "auto"),
              color: useLocalVar("color", "#111827"),
              // localVars 값이 지정 안 되어 있으면 level별 기본 스타일을 적용
              fontSize: useLocalVar("fontSize", defaultStyle.fontSize),
              fontWeight: useLocalVar("fontWeight", defaultStyle.fontWeight),
              lineHeight: useLocalVar("lineHeight", "1.25"),
              marginBottom: useLocalVar("marginBottom", defaultStyle.marginBottom),
              textAlign: useLocalVar("textAlign", "left") as React.CSSProperties["textAlign"],
            }}
            className={cn(
            "outline-none transition-all",
            isInlineEditing && "cursor-text ring-1 ring-blue-400 bg-blue-50/20 rounded px-1",
            className
            )}
        >
            {content}
        </HeaderTag>
    </PrimitiveBase>
  );
}

