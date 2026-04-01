import React, { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

// ComponentPropsWithoutRef로 통일하면 더 깔끔합니다.
interface CardProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={twMerge(
        "bg-bg-l2 border border-border-main rounded-xl shadow-soft overflow-hidden transition-shadow hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }: CardProps) => (
  <div className={twMerge("p-5 border-b border-border-main font-bold text-text-main", className)}>
    {children}
  </div>
);

export const CardContent = ({ children, className }: CardProps) => (
  <div className={twMerge("p-5 text-text-main", className)}>
    {children}
  </div>
);

export const CardFooter = ({ children, className }: CardProps) => (
  <div className={twMerge("p-4 bg-bg-l3/50 border-t border-border-main", className)}>
    {children}
  </div>
);