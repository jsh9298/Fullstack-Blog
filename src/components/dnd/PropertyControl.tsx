"use client";

import React from "react";
import { PropertyFieldSchema } from "@/src/types/builder";

interface PropertyControlProps {
  schema: PropertyFieldSchema;
  value: any;
  onChange: (value: any) => void;
}

export function PropertyControl({ schema, value, onChange }: PropertyControlProps) {
  const currentValue = value ?? "";

  switch (schema.controlType) {
    case "text":
      return (
        <input
          type="text"
          value={currentValue}
          placeholder={schema.placeholder}
          onChange={(e) => onChange(e.target.value)}
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
          className="w-full border border-gray-300 rounded p-2 text-xs outline-none focus:border-blue-500 transition-colors resize-y"
        />
      );

    case "select":
      return (
        <select
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 bg-white transition-colors cursor-pointer"
        >
          {schema.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "color":
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={currentValue || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={currentValue}
            placeholder="#000000"
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs outline-none font-mono focus:border-blue-500"
          />
        </div>
      );

    case "boolean":
      return (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600" />
        </label>
      );

    default:
      return null;
  }
}