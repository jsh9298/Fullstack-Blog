"use client";
import { PrimitiveBase } from "./PrimitiveBase";
import { BasePrimitiveProps } from "@/src/types/builder";
import { useLocalVar } from "@/src/utils/style";
import { cn } from "@/src/utils/cn";

export default function Input({
  placeholder =  "내용을 입력하세요...",
  type = "text",
  isEditing,
  className,
  ...props
}: BasePrimitiveProps & {placeholder?:string,type?:string}) {
  return (
    <PrimitiveBase {...props} isEditing={isEditing}>
       <input
          type={type}
          tabIndex={isEditing?-1:0}
          placeholder={placeholder}
          disabled={isEditing}
          style={{
            width: useLocalVar("width", "100%"),
            height: useLocalVar("height", "auto"),
            padding: useLocalVar("padding", "8px 12px"),
            backgroundColor: useLocalVar("bg", "#ffffff"),
            color: useLocalVar("color", "#111827"),
            fontSize: useLocalVar("fontSize", "14px"),
            borderRadius: useLocalVar("radius", "6px"),
            borderWidth: useLocalVar("borderWidth", "1px"),
            borderStyle: useLocalVar("borderStyle", "solid"),
            borderColor: useLocalVar("borderColor", "#d1d5db"),
          }}
          className={cn(
            "inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-95",
            className
          )}
        />
    </PrimitiveBase>
  );
}