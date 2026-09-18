"use client";

import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { useCodeEditor } from "./useCodeEditor";
import { Maximize2, Minimize2, Sun, Moon } from "lucide-react";
import { useState } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: "html" | "css" | "javascript" | "json";
  placeholder?: string;
  height?: string;
}

export function CodeEditor({ value, onChange, language, placeholder, height = "400px" }: CodeEditorProps) {
  const { theme, toggleTheme, handleDocChange } = useCodeEditor(onChange);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. 유저가 선택한 언어셋 에디터 엔진 확장 바인딩
  const getLanguageExtension = () => {
    switch (language) {
      case "html": return [html()];
      case "css": return [css()];
      case "javascript": return [javascript({ jsx: true })];
      default: return [];
    }
  };

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs transition-all duration-200 ${
      isFullscreen ? "fixed inset-0 z-50 h-screen w-screen rounded-none" : "w-full"
    }`}>
      {/* 💻 상단 개발자 전용 툴바 제어 판넬 */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-2 select-none">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </span>
          <span className="text-xs font-mono font-bold text-gray-500 uppercase ml-2 bg-gray-200 px-2 py-0.5 rounded">
            {language} editor
          </span>
        </div>

        {/* 테마 및 전체화면 제어 단축 툴 */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors cursor-pointer"
            title={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors cursor-pointer"
            title="전체화면 토글"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* ⚙️ CodeMirror 코어 탑재 영역 */}
      <div className="font-mono text-sm">
        <CodeMirror
          value={value}
          height={isFullscreen ? "calc(100vh - 40px)" : height}
          placeholder={placeholder || "// 코드를 입력하세요..."}
          theme={theme}
          extensions={getLanguageExtension()}
          onChange={handleDocChange}
          basicSetup={{
            lineNumbers: true,        // 줄 번호 활성화
            foldGutter: true,         // 코드 접기 가터 활성화
            dropCursor: true,         // 드롭 커서 지원
            allowMultipleSelections: true, // 멀티 커서 지원 (Alt + 클릭)
            indentOnInput: true,
          }}
        />
      </div>
    </div>
  );
}