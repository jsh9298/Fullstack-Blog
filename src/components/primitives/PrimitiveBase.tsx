"use client";

import React, { useMemo } from "react";
import { useScopedCss } from "@/src/hooks/useScopedCss";
import { BasePrimitiveProps } from "@/src/types/builder";
import { convertLocalVarsToCssVars } from "@/src/utils/style";
import { cn } from "@/src/utils/cn";

export interface PrimitiveBaseProps extends BasePrimitiveProps {
  children: React.ReactNode;
  as?: React.ElementType;
  style?: React.CSSProperties;
}

export function PrimitiveBase({
  id,
  customCss,
  localVars = {},
  style = {},
  children,
  className = "",
  isEditing = false,
  onSelect,
  as: Component = "div",
}: PrimitiveBaseProps) {
  const { scopeAttributeName, scopeAttributeValue, sanitizedCss, isValid } =
    useScopedCss({ componentId: id, customCss });

  const cssVarsStyle = useMemo(
    () => convertLocalVarsToCssVars(localVars),
    [localVars],
  );

  return (
    <Component
      {...{ [scopeAttributeName]: scopeAttributeValue }}
      style={{...cssVarsStyle,...style}}
      onClick={(e: React.MouseEvent) => {
        if (isEditing && onSelect && id) {
          e.stopPropagation(); // 부모 컨테이너로 버블링 방지
          onSelect(id,e);
        }
      }}
      className={cn("primitive-root relative group", className)}
    >
      {isValid && sanitizedCss && (
        <style dangerouslySetInnerHTML={{ __html: sanitizedCss }} />
      )}
      {/* 에디팅 모드일 때 포커스 및 텍스트 선택, 클릭 폼 제출 등을 방어 */}
      <div
        className={cn(
          "primitive-content",
          isEditing && "pointer-events-none select-none",
        )}
      >
        {children}
      </div>
    </Component>
  );
}
