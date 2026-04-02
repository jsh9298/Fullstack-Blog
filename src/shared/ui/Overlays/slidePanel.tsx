'use client';
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: "toast" | "bottom-sheet"; 
  children: ReactNode;
  duration?: number; 
}

export const SlidePanel = ({
  isOpen,
  onClose,
  variant = "bottom-sheet",
  children,
  duration = 3000
}: SlidePanelProps) => {
  // Toast일 경우 자동 소멸 로직
  useEffect(() => {
    if (isOpen && variant === "toast") {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, variant, onClose, duration]);

  if (!isOpen) return null;

  const positionStyles = {
    toast: "top-5 right-5 w-auto max-w-sm",
    "bottom-sheet": "bottom-0 left-0 right-0 w-full"
  };

  const animationStyles = {
    toast: "animate-in slide-in-from-right-full",
    "bottom-sheet": "animate-in slide-in-from-bottom-full"
  };

  return createPortal(
    <div className={twMerge("fixed z-[100]", positionStyles[variant], animationStyles[variant])}>
      {variant === "bottom-sheet" && (
        <div className="absolute inset-0 bg-black/20 -z-10" onClick={onClose} />
      )}
      <div className={twMerge(
        "bg-bg-l1 shadow-2xl border border-border-main",
        variant === "toast" ? "rounded-lg p-4" : "rounded-t-3xl p-6"
      )}>
        {variant === "bottom-sheet" && (
          <div className="w-12 h-1 bg-border-main mx-auto mb-4 rounded-full" />
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};