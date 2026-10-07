"use client";
import { PrimitiveBase } from "./PrimitiveBase";
import { BasePrimitiveProps } from "@/src/types/builder";
import { useLocalVar } from "@/src/utils/style";
import { cn } from "@/src/utils/cn";

export interface ButtonProps extends BasePrimitiveProps{
  label?:string
}

export function Button({
  label = "버튼",
  isEditing,
  className,
  ...props
}: ButtonProps) {
  return (
    <PrimitiveBase {...props} isEditing={isEditing}>
       <button
          type="button"
          tabIndex={isEditing?-1:0}
          style={{
            width: useLocalVar("width", "auto"),
            height: useLocalVar("height", "auto"),
            margin: useLocalVar("margin", "0px"),
            padding: useLocalVar("padding", "10px 20px"),
            backgroundColor: useLocalVar("bg", "#2563eb"),
            color: useLocalVar("color", "#ffffff"),
            fontSize: useLocalVar("fontSize", "14px"),
            fontWeight: useLocalVar("fontWeight", "500"),
            borderRadius: useLocalVar("radius", "6px"),
            borderWidth: useLocalVar("borderWidth", "0px"),
            borderStyle: useLocalVar("borderStyle", "solid"),
            borderColor: useLocalVar("borderColor", "transparent"),
            boxShadow: useLocalVar("shadow", "none"),
          }}
          className={cn(
            "inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-95",
            className
          )}
        >
        {label}
       </button>
    </PrimitiveBase>
  );
}