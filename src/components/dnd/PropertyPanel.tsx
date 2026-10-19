"use client";

import React from "react";
import { ItemSchema } from "@/src/types/builder";
import { PROPERTY_SCHEMAS } from "@/src/types/builder";
import { PropertyControl } from "./PropertyControl";

interface PropertyPanelProps {
  selectedItem: ItemSchema | null;
  onDeleteItem: (id: string) => void;
  onUpdateProps: (id: string, props: Record<string, any>) => void;
  onUpdateLocalVars: (id: string, localVars: Record<string, any>) => void;
  onCommit:()=>void;
}

export function PropertyPanel({ selectedItem,onDeleteItem,onUpdateProps,onUpdateLocalVars,onCommit }: PropertyPanelProps) {
  
  const fields = selectedItem!==null? PROPERTY_SCHEMAS[selectedItem.type] : [];
  const propsFields = fields.filter((f) => f.target === "props");
  const localVarsFields = fields.filter((f) => f.target === "localVars");
  
  if (!selectedItem) {
    return (
      <aside className="w-80 border-l border-gray-200 p-4 text-gray-400 text-sm">
        선택된 컴포넌트가 없습니다.
      </aside>
    );
  }

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
    <aside className="w-72 bg-white border-l p-4 overflow-y-auto space-y-6">

       <div className="border-b pb-3">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
          Component Inspector
        </span>
        <h3 className="font-bold text-gray-800 text-sm capitalize">
          {selectedItem.type}
        </h3>
        <p className="text-[11px] font-mono text-gray-400 truncate mt-0.5">
          {selectedItem.id}
        </p>
      </div>


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

      {/* 1. Component Props (속성 설정) */}
      {propsFields.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Props (컴포넌트 속성)
          </h4>
          <div className="space-y-2.5">
            {propsFields.map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-[11px] font-medium text-gray-600 block">
                  {field.label}
                </label>
                <PropertyControl
                  schema={field}
                  value={selectedItem.props[field.key]}
                  onChange={(val) => handleFieldChange(field.key, "props", val)} 
                  onCommit={onCommit}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. LocalVars Style Props (스타일 설정) */}
      {localVarsFields.length > 0 && (
        <div className="space-y-3 border-t pt-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Styles (LocalVars)
          </h4>
          <div className="space-y-2.5">
            {localVarsFields.map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="text-[11px] font-medium text-gray-600 block">
                  {field.label}
                </label>
                <PropertyControl
                  schema={field}
                  value={(selectedItem as any).localVars?.[field.key]}
                  onChange={(val) => handleFieldChange(field.key, "localVars", val)}
                  onCommit={onCommit}  
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}