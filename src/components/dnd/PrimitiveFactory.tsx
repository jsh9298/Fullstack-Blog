"use client";

import React from "react";
import { ItemSchema, PrimitiveType } from "@/src/types/builder";
import Button  from "@/src/components/primitives/Button";
import { Container } from "@/src/components/primitives/Container";

// 1. 원시 컴포넌트 레지스트리 맵
const PRIMITIVE_REGISTRY: Record<PrimitiveType, React.ComponentType<any>> = {
    button: Button,
    container: Container
};

interface PrimitiveFactoryProps {
  item: ItemSchema;
  isEditing?: boolean;
}

export function PrimitiveFactory({ item, isEditing }: PrimitiveFactoryProps) {
  const Component = PRIMITIVE_REGISTRY[item.type];

  if (!Component) {
    return <div className="text-red-500 text-xs">알 수 없는 컴포넌트 타입: {item.type}</div>;
  }

  // props, customCss, localVars를 공통 구조로 전달
  return (
    <Component
      id={item.id}
      customCss={item.customCss}
      localVars={item.localVars}
      isEditing={isEditing}
      {...item.props}
    />
  );
}