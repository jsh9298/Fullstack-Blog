"use client";

import React, { useState, useEffect }  from "react";
import { PropertyFieldSchema } from "@/src/types/builder";

interface PropertyControlProps {
  schema: PropertyFieldSchema;
  value: any;
  onChange: (value: any) => void;
  onCommit: () => void;
}

export function PropertyControl({ schema, value, onChange,onCommit }: PropertyControlProps) {
  const currentValue = value ?? "";

  switch (schema.controlType) {
    case "text":
      return (
        <input
          type="text"
          value={currentValue}
          placeholder={schema.placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onCommit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur(); // 엔터 키 입력 시 blur 유도하여 커밋
            }
          }}
          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 transition-colors"
        />
      );

    case "textarea":
      return (
        <textarea
          rows={3}
          value={currentValue}
          placeholder={schema.placeholder}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onCommit}
          className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:border-blue-500 transition-colors resize-y"
        />
      );

    case "select":
      return (
        <select
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onCommit}
          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 bg-white transition-colors cursor-pointer"
        >
          {schema.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "color":{
      const [currentValue,setcurrentValue] = useState<string>("#000000");
      useEffect(() => {
        setcurrentValue(currentValue);
      }, [currentValue]);
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={currentValue || "#000000"}
            onChange={(e) => {onChange(e.target.value);setcurrentValue(e.target.value);}}
            onBlur={onCommit}
            className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={currentValue}
            placeholder="#000000"
            onChange={(e) => {onChange(e.target.value);setcurrentValue(e.target.value);}}
            onBlur={onCommit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs outline-none font-mono focus:border-blue-500"
          />
        </div>
      );
    }

    case "boolean":
      return (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => {onChange(e.target.checked);onCommit();}}
            className="sr-only peer"
          />
          <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600" />
        </label>
      );
    
    case "range" : {
      // "16px" -> 16 으로 숫자 추출 (기본값: 0)
      const numericValue =
        typeof currentValue === "string"
          ? parseInt(currentValue.replace(/[^0-9]/g, ""), 10) || 0
          : Number(currentValue) || 0;

      const unit = schema.unit || "px";
      const min = schema.min ?? 0;
      const max = schema.max ?? 100;
      const step = schema.step ?? 1;
      // 텍스트 인풋 로컬 임시 상태 (타이핑 중 자연스러운 입력을 위해)
      const [localInputVal, setLocalInputVal] = useState<string>(String(numericValue));

      useEffect(() => {
        setLocalInputVal(String(numericValue));
      }, [numericValue]);

      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={numericValue}
              onChange={(e) => {
                const val = e.target.value;
                onChange(`${val}${unit}`); // 예: "16px" 형태로 스타일값 업데이트
              }}
              onMouseUp={onCommit}
              onTouchEnd={onCommit}
              onKeyUp={(e) => {
                // 키보드 화살표로 슬라이더 조작 후 엔터/스페이스 누를 때 커밋
                if (e.key === "Enter" || e.key === " ") onCommit();
              }}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex items-center border border-gray-300 rounded px-2 py-1 bg-white w-20 focus-within:border-blue-500">
              <input
                type="number"
                min={min}
                max={max}
                value={localInputVal}
                onChange={(e) => {
                  const rawVal = e.target.value;
                  setLocalInputVal(rawVal);
                  if (rawVal !== "") {
                    onChange(`${rawVal}${unit}`);
                  }
                }}
                onBlur={() => {
                  onCommit(); // 포커스가 벗어날 때 히스토리 커밋
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur(); // 엔터 키 입력 시 blur 유도하여 커밋
                  }
                }}
                className="w-full text-xs font-mono text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
                <span>{numericValue}{unit}</span>
                <span className="text-[10px] text-gray-400">
                  ({schema.min ?? 0} ~ {schema.max ?? 100}{unit})
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}