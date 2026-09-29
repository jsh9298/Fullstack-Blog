"use client"

import { useCallback, useState } from "react";

export function useCodeEditor(onChange?: (value: string) => void) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // 1. 소스코드 변경 핸들러 가로채기
  const handleDocChange = useCallback((value: string) => {
    if (onChange) {
      onChange(value);
    }
  }, [onChange]);

  // 2. 관리자 화면용 다크/라이트 테마 스위칭 유틸리티
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return {
    theme,
    toggleTheme,
    handleDocChange,
  };
}