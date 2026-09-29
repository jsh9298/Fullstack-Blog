import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import { twMerge } from "tailwind-merge"; // 클래스 중첩 방지 (권장)

// 1. 기본 textarea의 모든 속성을 상속받습니다.
interface TextAreaProps extends ComponentPropsWithoutRef<"textarea"> {
  label?: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* 라벨이 있을 경우에만 렌더링 */}
        {label && (
          <label className="text-sm font-semibold text-text-sub ml-1">
            {label}
          </label>
        )}

        <textarea
          {...props} // 부모로부터 받은 모든 속성 주입
          ref={ref}
          className={twMerge(
            // 기본 스타일 (우리가 globals.css 변수 활용)
            "w-full min-h-50 p-4 rounded-xl border transition-all duration-200 outline-none",
            "bg-bg-l2 border-border-main text-text-main shadow-soft",
            "placeholder:text-text-sub/40 resize-y",
            // 포커스 상태
            "focus:ring-2 focus:ring-brand focus:border-brand",
            // 에러 상태
            error && "border-red-500 focus:ring-red-400",
            className, // 외부에서 주입하는 추가 스타일
          )}
        />

        {/* 에러 메시지 */}
        {error && (
          <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>
        )}
      </div>
    );
  },
);
