import { ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot"; 
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  asChild = false,
  className,
  ...props
}: ButtonProps) => {
  const Component = asChild ? Slot : "button";

  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const styles = {
    primary: "bg-brand text-white hover:bg-brand-hover shadow-soft",
    secondary: "bg-bg-l3 text-text-main hover:bg-border-main",
    outline: "border border-border-main text-text-main hover:bg-bg-l2",
    ghost: "text-text-sub hover:text-text-main hover:bg-bg-l2",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-soft"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-base h-10",
    lg: "px-6 py-3 text-lg h-12",
  };

  return (
    <Component
      className={twMerge(base, styles[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
};