
"use client";

import React, { useReducer, useState } from "react";
import { ItemSchema, PrimitiveType } from "@/src/types/builder";
import { builderReducer, BuilderState } from "@/src/components/dnd/Reduser";
import { CanvasItem } from "@/src/components/dnd/CanvasItem";


const PALETTE_ITEMS: { type: PrimitiveType; label: string }[] = [
  { type: "container", label: "Container (박스/드롭존)" },
  { type: "heading", label: "Heading (제목)" },
  { type: "text", label: "Text (본문)" },
  { type: "input", label: "Input (입력창)" },
  { type: "options", label: "Option (체크/라디오)" },
  { type: "select", label: "Select (드롭다운)" },
  { type: "image", label: "Image (이미지)" },
  { type: "divider", label: "Divider (구분선)" },
];

const initialTree: ItemSchema[] = [
  {
    id: "container-1",
    type: "container",
    props: {},
    children: [
      {
        id: "heading-1",
        type: "heading",
        props: { level: "h2", content: "가이드선 위치 이동 테스트" },
      },
    ],
  },
];

const initialState: BuilderState = {
  tree: initialTree,
  selectedId: null,
  history: [initialTree],
  historyIndex: 0,
};

export default function NativeDndPage() {
  const [state, dispatch] = useReducer(builderReducer, initialState);
  const { tree, selectedId, history, historyIndex } = state;

  const [draggedPaletteType, setDraggedPaletteType] = useState<PrimitiveType | null>(null);
  const [draggedCanvasId, setDraggedCanvasId] = useState<string | null>(null);

  const handlePaletteDragStart = (type: PrimitiveType) => {
    setDraggedPaletteType(type);
    setDraggedCanvasId(null);
  };

  const handleCanvasDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedCanvasId(id);
    setDraggedPaletteType(null);
  };

  // 위치 가이드선(Top/Bottom/Inside)에 맞춘 드롭 처리
  const handleDropWithPosition = (
    e: React.DragEvent,
    targetParentId: string | null,
    targetIndex: number
  ) => {
    if (draggedPaletteType) {
      const newItem: ItemSchema = {
        id: `${draggedPaletteType}-${Date.now()}`,
        type: draggedPaletteType,
        props: getDefaultProps(draggedPaletteType),
        ...(draggedPaletteType === "container" ? { children: [] } : {}),
      };
      dispatch({
        type: "ADD_ITEM",
        payload: { newItem, parentId: targetParentId, index: targetIndex },
      });
    } else if (draggedCanvasId) {
      dispatch({
        type: "MOVE_ITEM",
        payload: {
          activeId: draggedCanvasId,
          targetParentId,
          index: targetIndex,
        },
      });
    }

    setDraggedPaletteType(null);
    setDraggedCanvasId(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden select-none">
      {/* 상단 Undo / Redo 헤더 */}
      <header className="h-14 bg-white border-b px-6 flex items-center justify-between">
        <h1 className="font-bold text-gray-800 text-sm">
          Pure React DnD Engine (Drop Indicator & History Stack)
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: "UNDO" })}
            disabled={historyIndex <= 0}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-all"
          >
            ↩ Undo
          </button>
          <button
            onClick={() => dispatch({ type: "REDO" })}
            disabled={historyIndex >= history.length - 1}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 transition-all"
          >
            ↪ Redo
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 팔레트 */}
        <aside className="w-64 bg-white border-r p-4 flex flex-col gap-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Palette
          </h2>
          {PALETTE_ITEMS.map((item) => (
            <div
              key={item.type}
              draggable
              onDragStart={() => handlePaletteDragStart(item.type)}
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing hover:border-blue-400 hover:bg-blue-50 transition-all text-sm font-medium text-gray-700"
            >
              {item.label}
            </div>
          ))}
        </aside>

        {/* 캔버스 드롭존 */}
        <main
          className="flex-1 p-8 overflow-y-auto bg-gray-100 flex justify-center"
          onClick={() => dispatch({ type: "SELECT_ITEM", payload: null })}
        >
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropWithPosition(e, null, tree.length)}
            className="w-full max-w-3xl min-h-[650px] bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 shadow-sm flex flex-col gap-2"
          >
            {tree.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                여기로 요소를 드래그하세요
              </div>
            ) : (
              tree.map((item, idx) => (
                <CanvasItem
                      key={item.id}
                      item={item}
                      itemIndex={idx}
                      parentId={null}
                      selectedId={selectedId}
                      onSelect={(id) => dispatch({ type: "SELECT_ITEM", payload: id })}
                      onRemove={(id) => dispatch({ type: "REMOVE_ITEM", payload: id })}
                      onDropWithPosition={handleDropWithPosition}
                      onCanvasDragStart={handleCanvasDragStart} 
                      onDropToContainer={function (e: React.DragEvent, targetContainerId: string): void {
                          throw new Error("Function not implemented.");
                      } }                />
              ))
            )}
          </div>
        </main>

        {/* 속성 패널 */}
        <aside className="w-72 bg-white border-l p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Property Panel
          </h2>
          {selectedId ? (
            <div className="text-xs font-mono text-gray-600">
              Selected Item: <span className="font-bold text-blue-600">{selectedId}</span>
            </div>
          ) : (
            <div className="text-xs text-gray-400">선택된 요소가 없습니다.</div>
          )}
        </aside>
      </div>
    </div>
  );
}

function getDefaultProps(type: PrimitiveType): Record<string, any> {
  switch (type) {
    case "heading":
      return { level: "h2", content: "새 타이틀" };
    case "text":
      return { content: "새로운 본문 텍스트입니다." };
    case "input":
      return { placeholder: "내용을 입력하세요..." };
    case "options":
      return { label: "선택 옵션", variant: "checkbox" };
    case "select":
      return { placeholder: "선택해 주세요" };
    case "image":
      return { src: "https://via.placeholder.com/600x200" };
    default:
      return {};
  }
}