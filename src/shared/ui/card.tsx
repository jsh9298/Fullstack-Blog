import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string; // 외부에서 추가 스타일(padding, margin 등)을 주입받기 위함
}

export const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div
      className={`
        bg-white 
        border 
        border-gray-200 
        rounded-xl 
        shadow-sm 
        overflow-hidden 
        transition-shadow 
        hover:shadow-md 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// 조금 더 세분화해서 쓰고 싶다면 아래처럼 Sub-component를 추가해도 좋습니다.
export const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 border-b border-gray-100 font-semibold ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 bg-gray-50 border-t border-gray-100 ${className}`}>{children}</div>
);