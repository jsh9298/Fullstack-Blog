import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends ComponentPropsWithoutRef<"input">{
    label?: string;
    error?: string;
}

export const InputText = ({label,error,className,...props}:InputProps) =>{
    
}