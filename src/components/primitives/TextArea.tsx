"use client";
import { PrimitiveBase } from "./PrimitiveBase";
import { BasePrimitiveProps } from "@/src/types/builder";
import { useLocalVar } from "@/src/utils/style";
import { cn } from "@/src/utils/cn";

export interface TextAreaProps extends BasePrimitiveProps {
  placeholder?: string;
  defaultValue?: string;
  rows?:number;
  cols?:number;
  resize?: "none" | "both" | "horizontal" | "vertical";
  name?:string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
}


export default function TextArea({
  placeholder =  "내용을 입력하세요...",
  defaultValue,
  value,
  rows = 4,
  cols = 33,
  name,
  onValueChange,
  isEditing = false,
  resize = "both",
  disabled = false,
  required = false,
  className,
  ...props
}: TextAreaProps) {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isEditing) {
      onValueChange?.(e.target.value);
    }
  };
  return (
    <PrimitiveBase {...props} isEditing={isEditing}>
       <textarea
          rows={rows}
          cols={cols}
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={handleChange}
          tabIndex={isEditing?-1:0}
          disabled={disabled || isEditing}
          required={required}
          style={{
            width: useLocalVar("width", "100%"),
            height: useLocalVar("height", "auto"),
            padding: useLocalVar("padding", "10px 12px"),
            backgroundColor: useLocalVar("bg", "#ffffff"),
            color: useLocalVar("color", "#111827"),
            lineHeight:useLocalVar("lineHeight", "1.5"),
            fontSize: useLocalVar("fontSize", "14px"),
            borderRadius: useLocalVar("radius", "6px"),
            borderWidth: useLocalVar("borderWidth", "1px"),
            borderStyle: useLocalVar("borderStyle", "solid"),
            borderColor: useLocalVar("borderColor", "#d1d5db"),
            resize: isEditing ? "none" : resize,
          }}
          className={cn(
        //     "w-full outline-none transition-all duration-150",
        //   "placeholder:text-gray-400",
        //   "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
        //   "disabled:cursor-default disabled:opacity-90",
            "inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-95",
            className
          )}
        />
    </PrimitiveBase>
  );
}