import { ComponentPropsWithoutRef, ElementType } from "react";
import { twMerge } from "tailwind-merge";

interface TypographyProps<T extends ElementType> {
  as?: T;
  variant?: "h1" | "h2" | "h3" | "body" | "caption";
  children: React.ReactNode;
}

export const Typography = <T extends ElementType = "p">({
  as,
  variant = "body",
  className,
  children,
  ...props
}: TypographyProps<T> & ComponentPropsWithoutRef<T>) => {
  const Component = as || "p";

  const styles = {
    h1: "text-4xl font-bold text-text-main",
    h2: "text-2xl font-bold text-text-main",
    h3: "text-xl font-semibold text-text-main",
    body: "text-base text-text-main",
    caption: "text-sm text-text-sub",
  };

  return (
    <Component className={twMerge(styles[variant], className)} {...props}>
      {children}
    </Component>
  );
};