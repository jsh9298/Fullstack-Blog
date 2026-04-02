import { ComponentPropsWithoutRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  label?: string;
  error?: string;
  leftSection?: ReactNode;  // 왼쪽 슬롯
  rightSection?: ReactNode; // 오른쪽 슬롯
}

export const InputText = ({
  label,
  error,
  leftSection,
  rightSection,
  className,
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-semibold text-text-sub ml-1">{label}</label>}
      
      <div className="relative flex items-center">
        {leftSection && <div className="absolute left-3 text-text-sub flex items-center">{leftSection}</div>}
        
        <input
          {...props}
          className={twMerge(
            "w-full px-4 py-2 h-10 rounded-xl border transition-all outline-none", // h-10으로 버튼과 높이 동기화
            "bg-bg-l2 border-border-main text-text-main shadow-soft",
            "focus:ring-2 focus:ring-brand/50 focus:border-brand",
            leftSection && "pl-10",
            rightSection && "pr-10",
            error && "border-red-500 focus:ring-red-400",
            className
          )}
        />
        
        {rightSection && <div className="absolute right-3 text-text-sub flex items-center">{rightSection}</div>}
      </div>

      {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
    </div>
  );
};