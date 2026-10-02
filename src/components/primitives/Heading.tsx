"use client";

import { PrimitiveBase } from "./PrimitiveBase";
import { BasePrimitiveProps } from "@/src/types/builder";
import { useLocalVar } from "@/src/utils/style";
import { cn } from "@/src/utils/cn";

export interface HeadingProps extends BasePrimitiveProps {
  content?: string;
  level?:"1"|"2"|"3"|"4"|"5"|"6";
  isInlineEditing?: boolean;
  onContentChange?: (newContent: string) => void;
}

export default function Heading({
  content =  "본문 텍스트를 입력하세요.",
  isEditing = false,
  isInlineEditing = false,
  level = "1",
  onContentChange,
  className,
  ...props
}: HeadingProps) {
    const handleChange = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isInlineEditing) {
      onContentChange?.(e.target.value);
    }
  };
  return (
    <PrimitiveBase {...props} isEditing={isEditing}>
        <h1
            contentEditable={isInlineEditing}
            suppressContentEditableWarning
            onBlur={handleChange}
            style={{
            width: useLocalVar("width", "auto"),
            margin: useLocalVar("margin", "0px 0px 12px 0px"),
            color: useLocalVar("color", "#374151"),
            fontSize: useLocalVar("fontSize", "16px"),
            fontWeight: useLocalVar("fontWeight", "400"),
            lineHeight: useLocalVar("lineHeight", "1.6"),
            textAlign: useLocalVar("textAlign", "left") as React.CSSProperties["textAlign"],
            }}
            className={cn(
            "outline-none transition-all",
            isInlineEditing && "cursor-text ring-1 ring-blue-400 bg-blue-50/20 rounded px-1",
            className
            )}
        >
            {content}
        </h1>
    </PrimitiveBase>
  );
}

