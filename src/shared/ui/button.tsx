import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size? : "sm" | "md" | "lg"
}

export const Button = ({ 
  children, 
  variant = "primary",
  size = "md",
  className, 
  ...props 
}: ButtonProps) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50";
  
  const styles = {
    // globals.css에 정의한 --brand와 --brand-hover 자동 계산색 활용
    primary: "bg-brand text-white hover:bg-brand-hover shadow-soft",
    secondary: "bg-bg-l3 text-text-main hover:bg-border-main",
    outline: "border border-border-main text-text-main hover:bg-bg-l2",
    ghost: "text-text-sub hover:text-text-main hover:bg-bg-l2",
    danger:"bg-brand text-red hover:bg-brand-hover shadow-soft"
  };

  const sizes = {
    sm:"",
    md:"",
    lg:"",
  }

  return (
    <button 
      className={twMerge(base, styles[variant],sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
};