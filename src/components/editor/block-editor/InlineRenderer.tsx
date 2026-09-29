import type { InlineTextNode } from "@/src/components/editor/editor-core/model/types";
import {cn} from "@/src/utils/cn";

interface InlineRendererProps{
    nodes: InlineTextNode[];
}

export function InlineRenderer({nodes}:InlineRendererProps){
    if(!nodes || nodes.length === 0){
        return (
            <span className="text-gray-400 select-none pointer-events-none">
                빈 블록...
            </span>
        )
    }
    return (
        <>
            {nodes.map((node,index)=>{
                const classes = cn({
                    "font-bold": node.bold,
                    "italic": node.italic,
                    "underline": node.underline,
                    "line-through": node.strikethrough,
                    "bg-gray-100 text-red-500 px-1.5 py-0.5 rounded text-xs font-mono": node.isInlineCode,
                });

                if(node.linkUrl && !node.isInlineCode){
                    return (
                        <a 
                            key={index} 
                            href={node.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn("text-blue-500 underline hover:text-blue-600 cursor-pointer", classes)}
                            contentEditable={false}
                        >
                            {node.text}
                        </a>
                    );
                }

                return (
                    <span key={index} className={classes}>
                        {node.text}
                    </span>
                );
            })}
        </>
    )
}