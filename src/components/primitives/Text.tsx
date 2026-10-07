"use client";

import { PrimitiveBase } from "./PrimitiveBase";
import { BasePrimitiveProps } from "@/src/types/builder";
import { useLocalVar } from "@/src/utils/style";
import { cn } from "@/src/utils/cn";

export interface TextProps extends BasePrimitiveProps {
  content?: string;
  isInlineEditing?: boolean;
  onContentChange?: (newContent: string) => void;
}

export function Text({
  content =  "본문 텍스트를 입력하세요.",
  isEditing,
  isInlineEditing = false,
  onContentChange,
  className,
  ...props
}: TextProps) {
  return (
    <PrimitiveBase {...props} isEditing={isEditing}>
        <p
            // contentEditable 활성화 여부
            contentEditable={isInlineEditing}
            suppressContentEditableWarning
            onBlur={(e) => {
            if (isInlineEditing) {
                onContentChange?.(e.currentTarget.textContent || "");
            }
            }}
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
        </p>
    </PrimitiveBase>
  );
}

