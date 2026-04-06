"use client";

import { useState, useRef, useEffect } from "react";
import { TextArea } from "@/src/shared/ui/DataEntry/textarea";

import dynamic from "next/dynamic";


//import { MarkdownRenderer } from "@/src/shared";
import { Button } from "@/src/shared/ui/Actions/button";
import { Bold, Italic, Link, Code, List, Image as ImageIcon } from "lucide-react";

const PreviewRenderer = dynamic(
  () => import("@/src/shared").then((mod)=>mod.MarkdownRenderer),
  {
    ssr: false,
    loading: () => <div className="p-6 text-text-sub">미리보기를 준비 중입니다...</div>,
  }
)

export const EditorContainer = () => {
  const [content, setContent] = useState("");
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (isSyncing.current) return;
    
    const source = e.currentTarget;
    const target = source === editorRef.current ? previewRef.current : editorRef.current;

    if (target) {
      isSyncing.current = true;
      const scrollRatio = source.scrollTop / (source.scrollHeight - source.clientHeight);
      target.scrollTop = scrollRatio * (target.scrollHeight - target.clientHeight);
      
      setTimeout(() => { isSyncing.current = false; }, 50);
    }
  };

  const insertText = (before: string, after: string = "") => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);

    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] border rounded-2xl overflow-hidden bg-bg-l1">
      <div className="flex items-center gap-1 p-2 border-b bg-bg-l2">
        <Button variant="ghost" size="sm" onClick={() => insertText("**", "**")}><Bold size={18} /></Button>
        <Button variant="ghost" size="sm" onClick={() => insertText("_", "_")}><Italic size={18} /></Button>
        <div className="w-px h-4 bg-border-main mx-1" />
        <Button variant="ghost" size="sm" onClick={() => insertText("[", "](url)")}><Link size={18} /></Button>
        <Button variant="ghost" size="sm" onClick={() => insertText("```\n", "\n```")}><Code size={18} /></Button>
        <Button variant="ghost" size="sm" onClick={() => insertText("- ")}><List size={18} /></Button>
        <Button variant="ghost" size="sm" onClick={() => insertText("![alt](", ")")}><ImageIcon size={18} /></Button>
      </div>

     
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 border-r overflow-hidden">
          <TextArea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onScroll={handleScroll}
            className="w-full h-full rounded-none border-none p-6 resize-none outline-none bg-transparent font-mono text-sm leading-relaxed"
            placeholder="마크다운으로 생각을 기록하세요..."
          />
        </div>

        <div 
          ref={previewRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 bg-bg-l2/30"
        >
          <PreviewRenderer content={content} />
        </div>
      </div>
    </div>
  );
};