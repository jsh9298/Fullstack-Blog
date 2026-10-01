import React from "react";
import { LocalStyleProps } from "@/src/types/builder";


const camelToKebab = (str:string) => {
    str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function convertLocalVarsToCssVars(localVars:LocalStyleProps ={}){
    const cssVars: Record<string,string|number> = {}

    Object.entries(localVars).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            const varName = `--local-${camelToKebab(key)}`;
            cssVars[varName] = value;
        }
    });

    return cssVars as React.CSSProperties;
}

export function useLocalVar(
    key: keyof LocalStyleProps,
    fallback: string | number
):string{
    const kebabKey = camelToKebab(key);
    return `var(--local-${kebabKey}, ${fallback})`
}