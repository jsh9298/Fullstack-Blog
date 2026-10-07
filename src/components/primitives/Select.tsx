"use client";

import { PrimitiveBase } from "./PrimitiveBase";
import { BasePrimitiveProps } from "@/src/types/builder";
import { useLocalVar } from "@/src/utils/style";
import { cn } from "@/src/utils/cn";


export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends BasePrimitiveProps {
  options?: SelectOption[];
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  onValueChange?: (value: string) => void;
}
const DEFAULT_OPTIONS: SelectOption[] = [
  { label: "옵션 1", value: "option1" },
  { label: "옵션 2", value: "option2" },
  { label: "옵션 3", value: "option3" },
];
export function Select({
  options = DEFAULT_OPTIONS,
  placeholder = "선택해 주세요",
  value,
  disabled = false,
  required = false,
  defaultValue,
  onValueChange,
  isEditing,
  className,
  ...props
}: SelectProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isEditing) {
      onValueChange?.(e.target.value);
    }
  };
  return (
    <PrimitiveBase {...props} isEditing={isEditing}>
       <div className="relative w-full">
        <select
            defaultValue={defaultValue ?? ""}
            value={value}
            disabled={disabled || isEditing}
            required={required}
            tabIndex={isEditing ? -1 : 0}
            onChange={handleChange}
            style={{
                width: useLocalVar("width", "100%"),
                height: useLocalVar("height", "auto"),
                padding: useLocalVar("padding", "8px 32px 8px 12px"),
                backgroundColor: useLocalVar("bg", "#ffffff"),
                color: useLocalVar("color", "#111827"),
                fontSize: useLocalVar("fontSize", "14px"),
                borderRadius: useLocalVar("radius", "6px"),
                borderWidth: useLocalVar("borderWidth", "1px"),
                borderStyle: useLocalVar("borderStyle", "solid"),
                borderColor: useLocalVar("borderColor", "#d1d5db"),
            }}
            className={cn(
                // "w-full appearance-none outline-none transition-all duration-150 cursor-pointer",
                // "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                // "disabled:cursor-default disabled:opacity-90",
                "inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-95",
                className
            )}>
                {placeholder && (
                    <option value="" disabled hidden>
                    {placeholder}
                    </option>
                )}
            {options.map((opt, idx) => (
                <option key={`${opt.value}-${idx}`} value={opt.value} disabled={opt.disabled}>
                {opt.label}
                </option>
            ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
            >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
            </div>
        </div>
    </PrimitiveBase>
  );
}
