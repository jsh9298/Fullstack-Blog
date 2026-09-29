"use client"

import React from "react";
import {cn} from "@/src/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
    id: string;
    isEditing?:boolean;
    userCustom?:{
        border?:string;
        padding:string;
        radius?:string;
        focusRing?:string;
    };
    customCss?:string;
}

export default function Input({
    id,
    children,
    isEditing,
    userCustom,
    customCss,
    onClick,
    onFocus,
    onChange,
    onKeyDown,
    className,
    style,
    ...props
}:InputProps){
    const customAttribute = `ipt-custom-${id}`;

    const sliderVars = {
    "--local-border":userCustom?.border,
    "--local-padding":userCustom?.padding,
    "--local-radius":userCustom?.radius,
    "--local-focus-ring":userCustom?.focusRing,
    } as React.CSSProperties;

    const scopedStyleString = customCss ?
        `[data-custom-skin="${customAttribute}"]{ ${customCss} }` : "";

    return (
        <>
            {customCss && (
                <style dangerouslySetInnerHTML={{ __html: scopedStyleString }} />
            )}
            <input
                {...props}
                data-custom-skin={customAttribute}
                style={{...sliderVars,...style}}
                className={cn()}
            />
        </>
        
    )
}