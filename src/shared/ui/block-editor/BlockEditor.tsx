"use client"

import type { EditorBlock } from "@/src/entities/editor-core/model/types";
import { useBlockEditor } from "./useBlockEditor";
import { BlockNode } from "./BlockNode";
import { PopoverToolbar } from "./PopoverToolbar";

interface BlockEditorProps {
  initialBlocks: EditorBlock[];
  onChange?: (blocks: EditorBlock[]) => void;
}

export function BlockEditor({ initialBlocks, onChange }: BlockEditorProps) {
  const {
    blocks,
    handleBeforeInput,
    handleKeyDown,
    handleBlur,
    handleTodoToggle,
    applyInlineStyle,
  } = useBlockEditor(initialBlocks, onChange);

  return (
    <div className="w-full relative max-w-4xl mx-auto px-4 py-8 min-h-[500px] border border-gray-100 rounded-xl bg-white shadow-xs">
      {/* 텍스트 드래그 감지 서식 주입용 공중 툴바 */}
      <PopoverToolbar onApplyStyle={applyInlineStyle} />

      {/* 블록 엔진 레이아웃 순회 출력 코어 */}
      <div className="flex flex-col gap-2 focus-visible:outline-none">
        {blocks.map((block) => (
          <BlockNode
            key={block.id}
            block={block}
            onBeforeInput={handleBeforeInput}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onTodoToggle={handleTodoToggle}
          />
        ))}
      </div>
    </div>
  );
}