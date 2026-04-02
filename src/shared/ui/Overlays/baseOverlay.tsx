// shared/ui/Overlays/BaseOverlay.tsx
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { Button } from "../Actions/button";

interface BaseOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: "modal" | "dialog"; 
  title?: string;
  children: ReactNode;
  onConfirm?: () => void; 
}

export const BaseOverlay = ({
  isOpen,
  onClose,
  variant = "modal",
  title,
  children,
  onConfirm
}: BaseOverlayProps) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Content */}
      <div className={twMerge(
        "relative bg-bg-l1 shadow-xl animate-in zoom-in-95 duration-200",
        variant === "modal" ? "w-full max-w-lg rounded-2xl" : "w-full max-w-sm rounded-xl"
      )}>
        <div className="p-6">
          {title && <h2 className="text-xl font-bold text-text-main mb-4">{title}</h2>}
          <div className="text-text-main">{children}</div>
          
          {/* Dialog일 때만 확인/취소 버튼 노출 */}
          {variant === "dialog" && (
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" size="sm" onClick={onClose}>취소</Button>
              <Button variant="primary" size="sm" onClick={onConfirm}>확인</Button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};