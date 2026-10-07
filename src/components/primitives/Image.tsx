"use client";

import React, { useState } from "react";
import { PrimitiveBase } from "./PrimitiveBase";
import { BasePrimitiveProps } from "@/src/types/builder"; 
import { useLocalVar } from "@/src/utils/style"; 
import { cn } from "@/src/utils/cn"; 

export interface ImageProps extends BasePrimitiveProps {
  src?: string;
  alt?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  loading?: "lazy" | "eager";
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const DEFAULT_IMAGE_PLACEHOLDER =
  "https://placehold.co/600x400?text=Image+Placeholder";

export function Image({
  src = DEFAULT_IMAGE_PLACEHOLDER,
  alt = "빌더 이미지",
  objectFit = "cover",
  loading = "lazy",
  fallbackSrc = DEFAULT_IMAGE_PLACEHOLDER,
  isEditing = false,
  className,
  ...baseProps
}: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  // src props가 바뀔 때 상태 업데이트
  React.useEffect(() => {
    setImgSrc(src || DEFAULT_IMAGE_PLACEHOLDER);
  }, [src]);

  return (
    <PrimitiveBase {...baseProps} isEditing={isEditing}>
      <img
        src={imgSrc}
        alt={alt}
        loading={isEditing ? "eager" : loading}
        // 에디터 상에서 이미지 드래그 선택 시 브라우저 기본 이미지 드래그 방지
        onDragStart={(e) => isEditing && e.preventDefault()}
        onError={() => setImgSrc(fallbackSrc)}
        style={{
          width: useLocalVar("width", "100%"),
          height: useLocalVar("height", "auto"),
          objectFit: useLocalVar("objectFit", objectFit) as React.CSSProperties["objectFit"],
          borderRadius: useLocalVar("radius", "0px"),
          borderWidth: useLocalVar("borderWidth", "0px"),
          borderColor: useLocalVar("borderColor", "transparent"),
          boxShadow: useLocalVar("shadow", "none"),
        }}
        className={cn(
          "block transition-all",
          isEditing && "pointer-events-none select-none", // 에디팅 시 드래그 동작 보호
          className
        )}
      />
    </PrimitiveBase>
  );
}