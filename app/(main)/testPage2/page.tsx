"use client";

import React, { useState } from "react";
import {
  insertItemToTree,
  removeItemFromTree,
  updateItemInTree,
} from "@/src/utils/tree";

import {ItemSchema,PrimitiveType} from "@/src/types/builder";
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

export default function NativeNestedDndPage() {
  const [tree, setTree] = useState<ItemSchema[]>([
    {
      id: "container-1",
      type: "container",
      props: {},
      children: [
        {
          id: "heading-1",
          type: "heading",
          props: { level: "h2", content: "중첩 컨테이너 내부 제목" },
        },
      ],
    },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 드래그 중인 데이터 추적 (팔레트 신규 추가 vs 캔버스 내부 이동)
  const [draggedPaletteType, setDraggedPaletteType] = useState<PrimitiveType | null>(null);
  const [draggedCanvasId, setDraggedCanvasId] = useState<string | null>(null);

  // 사이드바에서 드래그 시작
  const handlePaletteDragStart = (type: PrimitiveType) => {
    setDraggedPaletteType(type);
    setDraggedCanvasId(null);
  };

  // 캔버스 내 아이템 드래그 시작
  const handleCanvasDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    setDraggedCanvasId(id);
    setDraggedPaletteType(null);
  };

  // 공통 드롭 로직 (Root 또는 특정 Container Target)
  const handleDrop = (e: React.DragEvent, targetContainerId: string | null) => {
    e.preventDefault();
    e.stopPropagation();

    // 자기 자신 컨테이너 내부로 자기 자신을 드롭하는 순환 오류 방지
    if (draggedCanvasId && draggedCanvasId === targetContainerId) {
      return;
    }

    let updatedTree = [...tree];

    if (draggedPaletteType) {
      // 1. 팔레트에서 새 아이템을 드롭한 경우
      const newItem: ItemSchema = {
        id: `${draggedPaletteType}-${Date.now()}`,
        type: draggedPaletteType,
        props: getDefaultProps(draggedPaletteType),
        ...(draggedPaletteType === "container" ? { children: [] } : {}),
      };

      updatedTree = insertItemToTree(updatedTree, targetContainerId, newItem);
      setSelectedId(newItem.id);
    } else if (draggedCanvasId) {
      // 2. 기존 아이템을 다른 컨테이너(또는 루트)로 이동하는 경우
      const { newTree, removedItem } = removeItemFromTree(updatedTree, draggedCanvasId);
      if (removedItem) {
        updatedTree = insertItemToTree(newTree, targetContainerId, removedItem);
      }
    }

    setTree(updatedTree);
    setDraggedPaletteType(null);
    setDraggedCanvasId(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden select-none">
      <header className="h-14 bg-white border-b px-6 flex items-center justify-between">
        <h1 className="font-bold text-gray-800 text-base">
          Native Pure-React Nested Container DnD Engine
        </h1>
        <span className="text-xs text-gray-500">외부 라이브러리 없음 (No Zustand / No dnd-kit)</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 팔레트 */}
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

        {/* 메인 캔버스 드롭존 (Root Container) */}
        <main
          className="flex-1 p-8 overflow-y-auto bg-gray-100 flex justify-center"
          onClick={() => setSelectedId(null)}
        >
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, null)} // null은 Root 레벨을 의미함
            className="w-full max-w-3xl min-h-[650px] bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 shadow-sm flex flex-col gap-2"
          >
            {tree.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                여기로 요소를 드래그하세요
              </div>
            ) : (
              tree.map((item) => (
                <CanvasItem
                  key={item.id}
                  item={item}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onRemove={(id) => {
                    const { newTree } = removeItemFromTree(tree, id);
                    setTree(newTree);
                    setSelectedId(null);
                  }}
                  onDropToContainer={handleDrop}
                  onCanvasDragStart={handleCanvasDragStart}
                />
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