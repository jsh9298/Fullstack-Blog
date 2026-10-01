"use client";

import React from "react";
import { ItemData } from "./CanvasItem";

interface PropertyPanelProps {
  selectedItem: ItemData | null;
  onUpdateItem: (updatedItem: ItemData) => void;
  onDeleteItem?: (id: string) => void;
}

export function PropertyPanel({
  selectedItem,
  onUpdateItem,
  onDeleteItem,
}: PropertyPanelProps) {
  if (!selectedItem) {
    return (
      <aside className="w-80 bg-gray-50 border-l border-gray-200 p-6 flex items-center justify-center text-gray-400 text-xs">
        선택된 컴포넌트가 없습니다.
      </aside>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    onUpdateItem({
      ...selectedItem,
      props: { ...selectedItem.props, [key]: value },
    });
  };

  const handleLocalVarChange = (varName: string, value: string) => {
    onUpdateItem({
      ...selectedItem,
      localVars: { ...selectedItem.localVars, [varName]: value },
    });
  };

  return (
    <aside className="w-80 bg-white border-l border-gray-200 p-4 space-y-6 text-xs text-gray-700 select-none">
      <div className="flex justify-between items-center border-b pb-3">
        <h2 className="font-bold text-gray-800">{selectedItem.id} ({selectedItem.type})</h2>
        {onDeleteItem && (
          <button
            onClick={() => onDeleteItem(selectedItem.id)}
            className="text-red-500 hover:bg-red-50 p-1 rounded"
          >
            삭제
          </button>
        )}
      </div>

      {/* Props 설정 */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 border-b pb-1">일반 속성 (Props)</h3>
        {selectedItem.type === "button" && (
          <div>
            <label className="block mb-1 text-gray-500">버튼 라벨</label>
            <input
              type="text"
              value={selectedItem.props.label || ""}
              onChange={(e) => handlePropChange("label", e.target.value)}
              className="w-full border p-1.5 rounded"
            />
          </div>
        )}
        {selectedItem.type === "input" && (
          <div>
            <label className="block mb-1 text-gray-500">플레이스홀더</label>
            <input
              type="text"
              value={selectedItem.props.placeholder || ""}
              onChange={(e) => handlePropChange("placeholder", e.target.value)}
              className="w-full border p-1.5 rounded"
            />
          </div>
        )}
      </div>

      {/* Local Variables 설정 */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 border-b pb-1">스타일 변수 (Local CSS)</h3>
        <div>
          <label className="block mb-1 text-gray-500">배경 색상 (`--local-bg`)</label>
          <input
            type="color"
            value={selectedItem.localVars?.["--local-bg"] || "#2563eb"}
            onChange={(e) => handleLocalVarChange("--local-bg", e.target.value)}
            className="w-full h-8 cursor-pointer p-0.5 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-500">테두리 곡률 (`--local-radius`)</label>
          <input
            type="range"
            min="0"
            max="20"
            value={parseInt(selectedItem.localVars?.["--local-radius"] || "6", 10)}
            onChange={(e) => handleLocalVarChange("--local-radius", `${e.target.value}px`)}
            className="w-full"
          />
        </div>
      </div>
    </aside>
  );
}