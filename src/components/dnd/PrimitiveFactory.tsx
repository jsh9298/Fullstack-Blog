"use client";

import React from "react";
import { ItemSchema, PrimitiveType } from "@/src/types/builder";
import {Button,Container,Image,Input,Select,Text,TextArea,Heading,Options,Divider} from "@/src/components/primitives";

// 1. 원시 컴포넌트 레지스트리 맵
const PRIMITIVE_REGISTRY: Record<PrimitiveType, React.ComponentType<any>> = {
  button: Button,
  container: Container,
  input: Input,
  textarea: TextArea,
  select: Select,
  text: Text,
  heading: Heading,
  image: Image,
  options: Options,
  divider: Divider
};

interface PrimitiveFactoryProps {
  item: ItemSchema;
  isEditing?: boolean;
}

export function PrimitiveFactory({ item, isEditing = true }: PrimitiveFactoryProps) {
  
  const Component = PRIMITIVE_REGISTRY[item.type];

  if (!Component) {
    return <div className="p-2 border border-red-300 text-xs text-red-500">알 수 없는 컴포넌트 타입: {item.type}</div>;
  }

  return (
    <Component {...item.props} isEditing={isEditing}/>
  );
}