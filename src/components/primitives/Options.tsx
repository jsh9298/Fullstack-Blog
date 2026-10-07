"use client";

import React from "react";
import { PrimitiveBase } from "./PrimitiveBase";
import { BasePrimitiveProps } from "@/src/types/builder"; 
import { useLocalVar } from "@/src/utils/style"; 
import { cn } from "@/src/utils/cn"; 

export type OptionVariant = "checkbox" | "radio" | "switch";

export interface OptionProps extends BasePrimitiveProps {
  variant?: OptionVariant;
  label?: string;
  name?: string; // radio 그룹화용 name 속성
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Options({
  variant = "checkbox",
  label = "선택 옵션",
  name,
  checked,
  defaultChecked = false,
  disabled = false,
  required = false,
  isEditing = false,
  onCheckedChange,
  className,
  ...baseProps
}: OptionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) {
      onCheckedChange?.(e.target.checked);
    }
  };

  return (
    <PrimitiveBase {...baseProps} isEditing={isEditing}>
      <label
        style={{
          color: useLocalVar("color", "#374151"),
          fontSize: useLocalVar("fontSize", "14px"),
          gap: useLocalVar("gap", "8px"),
        }}
        className={cn(
          "inline-flex items-center select-none cursor-pointer",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        {/* Switch 형태일 때와 Checkbox/Radio 형태 구분 */}
        {variant === "switch" ? (
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={checked}
              defaultChecked={defaultChecked}
              disabled={disabled || isEditing}
              tabIndex={isEditing ? -1 : 0}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div
              style={{
                backgroundColor: useLocalVar("bg", "#e5e7eb"),
              }}
              className={cn(
                "w-9 h-5 rounded-full transition-colors",
                "peer-checked:bg-blue-600",
                "peer-focus:ring-2 peer-focus:ring-blue-500/20"
              )}
            />
            <div
              className={cn(
                "absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform",
                "peer-checked:translate-x-4"
              )}
            />
          </div>
        ) : (
          <input
            type={variant} // "checkbox" 또는 "radio"
            name={name}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled || isEditing}
            required={required}
            tabIndex={isEditing ? -1 : 0}
            onChange={handleChange}
            style={{
              borderColor: useLocalVar("borderColor", "#d1d5db"),
            }}
            className={cn(
              "w-4 h-4 transition-all border cursor-pointer text-blue-600 focus:ring-blue-500",
              variant === "checkbox" ? "rounded" : "rounded-full",
              disabled && "cursor-not-allowed"
            )}
          />
        )}

        {/* 옵션 라벨 텍스트 */}
        {label && <span className="leading-none">{label}</span>}
      </label>
    </PrimitiveBase>
  );
}