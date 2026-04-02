import { ComponentPropsWithoutRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { twMerge } from "tailwind-merge";

interface BadgeProps extends ComponentPropsWithoutRef<"span">{
    variant? : "success"|"warning"|"error"|"info",
    asChild?:boolean
}

export const Badge = ({ children, variant = "info", asChild = false, className, ...props }: BadgeProps) => {
    const Component = asChild ? Slot : "span";

    const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border";

    const styles = {
        success: "bg-green-100 text-green-800 border-green-200",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
        error: "bg-red-100 text-red-800 border-red-200",
        info: "bg-blue-100 text-blue-800 border-blue-200"
    };

    return (
        <Component className={twMerge(base, styles[variant], className)} {...props}>
            {children}
        </Component>
    );
};