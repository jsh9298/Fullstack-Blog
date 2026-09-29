import { type ClassValue,clsx } from "clsx";
import { twMerge } from "tailwind-merge";

//tailwind클래스 병합 유틸
export function cn(...inputs:ClassValue[]){
    return twMerge(clsx(inputs));
}