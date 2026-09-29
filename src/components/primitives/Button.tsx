"use client";

import React from "react";
import { cn } from "@/src/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  isEditing?: boolean;
  userCustom?: {
    bgColor?: string;
    textColor?:string;
    border?:string;
    padding?: string;
    borderRadius?: string;
  };
  customCss?: string;
}

export default function Button({
  id,
  children,
  isEditing = false,
  userCustom,
  customCss,
  onClick,
  onKeyDown,
  className,
  style,
  type = "button",
  ...props
}: ButtonProps) {
  const customAttribute = `btn-custom-${id}`;

  const handleClientClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isEditing) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onClick) onClick(e);
  };

  const handleClientKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if(isEditing){
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if(onKeyDown) onKeyDown(e);
  }

  const sliderVars = {
    "--local-color": userCustom?.textColor || "",
    "--local-border": userCustom?.border || "",
    "--local-padding": userCustom?.padding || "0.5rem 1rem",
    "--local-bg": userCustom?.bgColor || "var(--primary-color, #0070f3)",
    "--local-radius": userCustom?.borderRadius || "var(--border-radius, 8px)",
  } as React.CSSProperties;

  const scopedStyleString = customCss
    ? `[data-custom-skin="${customAttribute}"] { ${customCss} }`
    : "";

  return (
    <>
      {customCss && (
        <style dangerouslySetInnerHTML={{ __html: scopedStyleString }} />
      )}
      <button
        {...props}
        type={type}
        onClick={handleClientClick}
        onKeyDown={handleClientKeyDown}
        data-custom-skin={customAttribute}
        style={{ ...sliderVars, ...style }}
        className={cn(
          "text-white font-medium transition-all select-none border border-transparent outline-none flex items-center justify-center",
          "bg-[var(--local-primary)] p-[var(--local-padding)] rounded-[var(--local-radius)]",
          isEditing
            ? "cursor-move opacity-90 border-dashed border-gray-400/60 shadow-sm"
            : "cursor-pointer hover:opacity-90 active:scale-[0.97]",
          className
        )}
      >
        {children}
      </button>
    </>
  );
}