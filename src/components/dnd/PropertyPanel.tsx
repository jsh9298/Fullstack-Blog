"use client";

import React from "react";
import { ItemSchema } from "@/src/types/builder";
import { PROPERTY_SCHEMAS } from "@/src/types/builder";
import { PropertyControl } from "./PropertyControl";

interface PropertyPanelProps {
  selectedItem: ItemSchema ;//| null;
  onUpdateItem: (updatedItem: ItemSchema) => void;
  onDeleteItem?: (id: string) => void;
  onUpdateProps: (id: string, props: Record<string, any>) => void;
  onUpdateLocalVars: (id: string, localVars: Record<string, any>) => void;
}

export function PropertyPanel({ selectedItem, onUpdateItem,onDeleteItem,onUpdateProps,onUpdateLocalVars }: PropertyPanelProps) {
  
  const fields = PROPERTY_SCHEMAS[selectedItem.type] || [];
  const propsFields = fields.filter((f) => f.target === "props");
  const localVarsFields = fields.filter((f) => f.target === "localVars");
  
  if (!selectedItem) {
    return (
      <aside className="w-80 border-l border-gray-200 p-4 text-gray-400 text-sm">
        선택된 컴포넌트가 없습니다.
      </aside>
    );
  }

  // LocalVar 상태 변경 핸들러
  const handleLocalVarChange = (key: string, value: string) => {
    onUpdateItem({
      ...selectedItem,
      localVars: {
        ...selectedItem.localVars,
        [key]: value,
      },
    });
  };

  // Props 상태 변경 핸들러 (버튼 텍스트 등)
  const handlePropChange = (key: string, value: any) => {
    onUpdateItem({
      ...selectedItem,
      props: {
        ...selectedItem.props,
        [key]: value,
      },
    });
  };


  const handleFieldChange = (
    key: string,
    target: "props" | "localVars",
    newValue: any
  ) => {
    if (target === "props") {
      onUpdateProps(selectedItem.id, {
        ...selectedItem.props,
        [key]: newValue,
      });
    } else {
      onUpdateLocalVars(selectedItem.id, {
        ...(selectedItem as any).localVars,
        [key]: newValue,
      });
    }
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
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 border-b pb-2">
          속성 편집 ({selectedItem.type})
        </h3>

        {/* 1. 컴포넌트 고유 Props 수정 (예: 버튼 라벨) */}
        {selectedItem.props.label !== undefined && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">라벨 텍스트</label>
            <input
              type="text"
              value={selectedItem.props.label || ""}
              onChange={(e) => handlePropChange("label", e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>
      {/* 2. UI 컨트롤러 기반 LocalVars 수정 (배경색, 패딩) */}
      <div className="space-y-3 border-t pt-4">
        <h4 className="text-xs font-bold text-gray-500 uppercase">스타일 설정 (LocalVars)</h4>
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">배경색 (bg)</label>
          <input
            type="color"
            value={selectedItem.localVars?.bg || "#2563eb"}
            onChange={(e) => handleLocalVarChange("bg", e.target.value)}
            className="w-full h-8 cursor-pointer rounded border"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">패딩 (padding)</label>
          <input
            type="text"
            value={selectedItem.localVars?.padding || "10px 20px"}
            onChange={(e) => handleLocalVarChange("padding", e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* 3. 유저 직접 작성 Scoped CSS 수정 */}
      <div className="space-y-1 border-t pt-4">
        <label className="text-xs font-bold text-gray-500 uppercase">커스텀 Scoped CSS</label>
        <textarea
          rows={4}
          value={selectedItem.customCss || ""}
          onChange={(e) =>
            onUpdateItem({ ...selectedItem, customCss: e.target.value })
          }
          placeholder="button:hover { brightness: 1.1; }"
          className="w-full border rounded p-2 text-xs font-mono outline-none focus:border-blue-500"
        />
      </div>
    </aside>
  );



  // return (
  //   <aside className="w-72 bg-white border-l p-4 overflow-y-auto space-y-6">
  //     {/* 헤더 */}
  //     <div className="border-b pb-3">
  //       <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
  //         Component Inspector
  //       </span>
  //       <h3 className="font-bold text-gray-800 text-sm capitalize">
  //         {selectedItem.type}
  //       </h3>
  //       <p className="text-[11px] font-mono text-gray-400 truncate mt-0.5">
  //         {selectedItem.id}
  //       </p>
  //     </div>

  //     {/* 1. Component Props (속성 설정) */}
  //     {propsFields.length > 0 && (
  //       <div className="space-y-3">
  //         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
  //           Props (컴포넌트 속성)
  //         </h4>
  //         <div className="space-y-2.5">
  //           {propsFields.map((field) => (
  //             <div key={field.key} className="space-y-1">
  //               <label className="text-[11px] font-medium text-gray-600 block">
  //                 {field.label}
  //               </label>
  //               <PropertyControl
  //                 schema={field}
  //                 value={selectedItem.props[field.key]}
  //                 onChange={(val) => handleFieldChange(field.key, "props", val)}
  //               />
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     )}

  //     {/* 2. LocalVars Style Props (스타일 설정) */}
  //     {localVarsFields.length > 0 && (
  //       <div className="space-y-3 border-t pt-4">
  //         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
  //           Styles (LocalVars)
  //         </h4>
  //         <div className="space-y-2.5">
  //           {localVarsFields.map((field) => (
  //             <div key={field.key} className="space-y-1">
  //               <label className="text-[11px] font-medium text-gray-600 block">
  //                 {field.label}
  //               </label>
  //               <PropertyControl
  //                 schema={field}
  //                 value={(selectedItem as any).localVars?.[field.key]}
  //                 onChange={(val) =>
  //                   handleFieldChange(field.key, "localVars", val)
  //                 }
  //               />
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     )}
  //   </aside>
  // );
}