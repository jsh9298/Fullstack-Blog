"use client";

import { useEffect } from "react";

interface UseCanvasHotkeysProps {
  dispatch: React.Dispatch<any>;
  selectedId: string | null;
}

export function useCanvasHotkeys({ dispatch, selectedId }: UseCanvasHotkeysProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // 1. 입력창(input, textarea, contenteditable)에서 타이핑 중일 때는 
      // 단축키(Delete 등)로 인해 글자가 지워지거나 오작동하는 것을 방지
      const isInputActive =
        ["INPUT", "TEXTAREA"].includes(target.tagName) ||
        target.isContentEditable;

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      // 2. Undo: Ctrl + Z (Mac은 Cmd + Z) / Redo 제외
      if (isCtrlOrCmd && e.key.toLowerCase() === "z" && !e.shiftKey) {
        if (isInputActive) return;
        e.preventDefault();
        dispatch({ type: "UNDO" });
        return;
      }

      // 3. Redo: Ctrl + Y 또는 Ctrl + Shift + Z (Mac은 Cmd + Shift + Z)
      if (
        (isCtrlOrCmd && e.key.toLowerCase() === "y") ||
        (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        if (isInputActive) return;
        e.preventDefault();
        dispatch({ type: "REDO" });
        return;
      }

      // 4. Delete / Backspace: 선택된 컴포넌트 삭제
      if (e.key === "Delete" || e.key === "Backspace") {
        if (isInputActive) return; // 인풋창 내부 백스페이스는 허용
        if (!selectedId) return;   // 선택된 아이템이 없으면 무시

        e.preventDefault();
        dispatch({ type: "REMOVE_ITEM", payload: selectedId });
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch, selectedId]);
}