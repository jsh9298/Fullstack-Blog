"use client";
import { PrimitiveBase } from "./PrimitiveBase";
import { BasePrimitiveProps } from "@/src/types/builder";
import { useLocalVar } from "@/src/utils/style";
import { cn } from "@/src/utils/cn";

export interface InputProps extends BasePrimitiveProps {
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  name?:string;
  disabled?: boolean;
  required?: boolean;
  onValueChange?: (value: string) => void;
}

export default function Input({
  placeholder =  "내용을 입력하세요...",
  defaultValue = "",
  type = "text",
  isEditing = false,
  name,
  value,
  className,
  disabled = false,
  required = false,
  onValueChange,
  ...props
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) {
      onValueChange?.(e.target.value);
    }
  };
  return (
    <PrimitiveBase {...props} isEditing={isEditing}>
       <input
          type={type}
          tabIndex={isEditing?-1:0}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          disabled={disabled || isEditing}
          name={name}
          required={required}
          onChange={handleChange}
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
          //   "w-full outline-none transition-all duration-150",
          // "placeholder:text-gray-400",
          // "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          // "disabled:cursor-default disabled:opacity-90",
            "inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-95",
            className
          )}
        />
    </PrimitiveBase>
  );
}