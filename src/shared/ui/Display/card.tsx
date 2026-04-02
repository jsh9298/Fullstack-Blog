import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface BaseProps {
  children?: ReactNode;
  className?: string;
}

interface CardProps<T extends ElementType> extends BaseProps {
  as?: T;
}

export const Card = <T extends ElementType = "div">({
  as,
  children,
  className,
  ...props
}: CardProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof CardProps<T>>) => {
  const Component = as || "div";
  return (
    <Component
      className={twMerge(
        "bg-bg-l2 border border-border-main rounded-xl shadow-soft overflow-hidden flex flex-col",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};


export const CardHeader = ({ children, className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div 
    className={twMerge("p-5 border-b border-border-main font-bold text-lg text-text-main", className)} 
    {...props}
  >
    {children}
  </div>
);

export const CardContent = ({ children, className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div 
    className={twMerge("p-5 text-text-main flex-1", className)} 
    {...props}
  >
    {children}
  </div>
);

export const CardFooter = ({ children, className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div 
    className={twMerge("p-4 bg-bg-l3/30 border-t border-border-main", className)} 
    {...props}
  >
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;