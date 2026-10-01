// "use client";

// import React, { useState } from "react";
// import { useDnDGuard } from "@/src/hooks/useDnDGuard";
// import { CanvasItem, ItemData } from "@/src/components/dnd/CanvasItem";

// const INITIAL_ITEMS: ItemData[] = [
//   {
//     id: "btn-1",
//     label: "커스텀 버튼",
//     type: "button",
//     customCss: ".custom-btn { background-color: var(--local-bg, #10b981); border-radius: 9999px; }",
//     localVars: { "--local-bg": "#8b5cf6" },
//   },
//   {
//     id: "input-1",
//     label: "텍스트 입력란",
//     type: "input",
//     customCss: ".custom-input { border-color: #f59e0b; background-color: #fffbeb; }",
//   },
//   {
//     id: "slider-1",
//     label: "볼륨 슬라이더",
//     type: "range",
//     customCss: "body { display: none; }", // 유저 악의적 CSS 테스트 (useScopedCss 가드에 의해 차단됨)
//   },
// ];

// export default function BuilderCanvasPage() {
//   const [items, setItems] = useState<ItemData[]>(INITIAL_ITEMS);
//   const [isEditing, setIsEditing] = useState<boolean>(true);

//   // DnD 최적화 및 엣지케이스 가드 훅 연결
//   const { draggedIndex, dragOverIndex, bindDragSource, bindDropTarget } =
//     useDnDGuard<ItemData>({
//       items,
//       onReorder: (newItems) => setItems(newItems),
//     });

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
//         {/* 상단 컨트롤 바 */}
//         <div className="flex items-center justify-between pb-6 mb-6 border-b">
//           <div>
//             <h1 className="text-xl font-bold text-gray-800">
//               Canvas DnD & Scoped CSS 테스트
//             </h1>
//             <p className="text-xs text-gray-500 mt-1">
//               드래그 도중 <kbd className="px-1 bg-gray-200 rounded">ESC</kbd>를 누르면 드래그가 취소됩니다.
//             </p>
//           </div>

//           <button
//             onClick={() => setIsEditing(!isEditing)}
//             className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
//               isEditing
//                 ? "bg-amber-500 text-white hover:bg-amber-600"
//                 : "bg-emerald-500 text-white hover:bg-emerald-600"
//             }`}
//           >
//             모드 전환: {isEditing ? "에디팅 모드 ON" : "미리보기 모드 (실제 폼 조작)"}
//           </button>
//         </div>

//         {/* 캔버스 렌더링 영역 */}
//         <div className="min-h-[300px]">
//           {items.map((item, index) => {
//             const dragProps = isEditing ? bindDragSource(index) : {};
//             const dropProps = isEditing ? bindDropTarget(index) : {};

//             return (
//               <CanvasItem
//                 key={item.id}
//                 item={item}
//                 isEditing={isEditing}
//                 dragProps={dragProps}
//                 dropProps={dropProps}
//                 isDragging={draggedIndex === index}
//                 isDragOver={dragOverIndex === index}
//               />
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";

// import React, { useState } from "react";
// import { useDnDGuard } from "@/src/hooks/useDnDGuard";
// import { CanvasItem, ItemData } from "@/src/components/dnd/CanvasItem";

import React, { useState, useRef } from "react";
import { useDnDGuard } from "@/src/hooks/useDnDGuard";
import { CanvasItem, ItemData } from "@/src/components/dnd/CanvasItem";
import { SelectionOverlay } from "@/src/components/dnd/SelectionOverlay";
import { PropertyPanel } from "@/src/components/dnd/PropertyPanel";

const INITIAL_ITEMS: ItemData[] = [
  {
    id: "btn-1",
    type: "button",
    label:"",
    props: { label: "제출하기" },
    localVars: { "--local-bg": "#2563eb", "--local-radius": "6px" },
  },
  {
    id: "input-1",
    type: "input",
    label:"",
    props: { placeholder: "이메일을 입력하세요" },
    localVars: { "--local-radius": "4px" },
  },
];

export default function BuilderPage() {
  const [items, setItems] = useState<ItemData[]>(INITIAL_ITEMS);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [selectedId, setSelectedId] = useState<string | null>("btn-1");
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const { draggedIndex, dragOverIndex, bindDragSource, bindDropTarget } =
    useDnDGuard<ItemData>({
      items,
      onReorder: (newItems) => setItems(newItems),
    });

  const selectedItem = items.find((item) => item.id === selectedId) || null;

  const handleUpdateItem = (updatedItem: ItemData) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleUpdateStyle = (id: string, newVars: Record<string, string>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, localVars: { ...item.localVars, ...newVars } }
          : item
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* 캔버스 영영 */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">Builder Canvas</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 text-xs bg-amber-500 text-white rounded font-medium"
            >
              모드: {isEditing ? "에디팅 모드 ON" : "미리보기 모드"}
            </button>
          </div>

          <div
            ref={canvasRef}
            onClick={() => setSelectedId(null)}
            className="relative bg-white p-6 rounded-xl shadow-md min-h-[400px]"
          >
            {items.map((item, index) => {
              const dragProps = isEditing ? bindDragSource(index) : {};
              const dropProps = isEditing ? bindDropTarget(index) : {};

              return (
                <CanvasItem
                  key={item.id}
                  item={item}
                  isEditing={isEditing}
                  isSelected={selectedId === item.id}
                  onSelect={(id) => setSelectedId(id)}
                  dragProps={dragProps}
                  dropProps={dropProps}
                  isDragging={draggedIndex === index}
                  isDragOver={dragOverIndex === index}
                />
              );
            })}

            {/* 선택 상자 오버레이 가상 레이어 */}
            {isEditing && (
              <SelectionOverlay
                selectedId={selectedId}
                canvasRef={canvasRef}
                onUpdateStyle={handleUpdateStyle}
              />
            )}
          </div>
        </div>
      </main>

      {/* 우측 속성 패널 */}
      {isEditing && (
        <PropertyPanel
          selectedItem={selectedItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={(id) => {
            setItems((prev) => prev.filter((item) => item.id !== id));
            setSelectedId(null);
          }}
        />
      )}
    </div>
  );
}