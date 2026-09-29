"use client"

import { BlockType, EditorBlock } from "@/src/components/editor/editor-core/model/types";
import { useCallback, useState } from "react";

export function useBlockEditor(initialBlocks: EditorBlock[], onChange?: (blocks: EditorBlock[]) => void) {
    const [blocks,setBlocks] = useState<EditorBlock[]>(
      initialBlocks.length>0? initialBlocks :
        [ 
            { 
                id: "init-id", 
                type: "paragraph", 
                children: [{ text: "" }] 
            }
        ]
    );//state 지연 초기화

    //이벤트 감지시 blocks 업데이트
    const updateGlobalState = (newBlocks:EditorBlock[]) => {
        setBlocks(newBlocks);
        if(onChange){
            onChange(newBlocks);
        }
    }

    //블록생성시 강제 포커싱
    const moveCaretToBlock = useCallback((blockId:string,offset:number)=>{
        setTimeout(()=>{
            const element = document.querySelector(`[data-block-id="${blockId}"]`);
            if(!element) {
                return;
            }
            const selection = window.getSelection();
            const range = document.createRange();

            const targetNode = element.firstChild||element;

            try{
                range.setStart(targetNode,Math.min());
                range.collapse(true)
                selection?.removeAllRanges();
                selection?.addRange(range);
                (element as HTMLElement).focus();
            }catch(err){
                console.error("Caret Recovery Failed:", err);
            }

        },0);
    },[]);

    const handleBeforeInput = useCallback((e: React.InputEvent<HTMLDivElement>,blockId:string)=>{
        const inputEvent:InputEvent = e.nativeEvent;

        if(inputEvent.inputType == "insertText" && inputEvent.data === " "){
            const currentText = e.currentTarget.textContent || "";
            const pattern: Record<string,BlockType> = {
                "#": "heading1",
                "##": "heading2",
                "###": "heading3",
                ">": "blockquote",
                "-": "bulleted-list-item",
                "1.": "numbered-list-item",
                "[]": "todo-list-item",
                "```": "codeblock"
            };

            if(currentText in pattern){
                e.preventDefault();

                const nextBlocks = blocks.map((b)=>{
                    if(b.id !== blockId){
                        return b;
                    }
                    return {...b,type:pattern[currentText],children:[{text:""}]}
                });

                updateGlobalState(nextBlocks);
                moveCaretToBlock(blockId,0);
            }

        }

    },[blocks, moveCaretToBlock]);

    const handleKeyDown = useCallback((e:React.KeyboardEvent<HTMLDivElement>,blockId:string)=>{
        const index = blocks.findIndex((b)=>b.id===blockId);
        if(index === -1) return;

        const currentBlock = blocks[index];
        const currentEl:HTMLElement = e.currentTarget;

        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            if (currentBlock.type === "codeblock") {
                const selection = window.getSelection();
                if (selection && !selection.rangeCount) return;

                if(selection && selection.rangeCount){
                    // 1. 현재 커서 위치(Range) 가져오기
                    const range = selection.getRangeAt(0);
                    
                    // 2. 줄바꿈(\n) 텍스트 노드 생성
                    const textNode = document.createTextNode("\n");
                    
                    // 3. 커서 자리에 텍스트 노드 삽입 및 삭제된 텍스트 처리
                    range.deleteContents();
                    range.insertNode(textNode);
                    
                    // 4. 커서의 위치를 삽입한 줄바꿈(\n) 바로 뒤로 이동
                    range.setStartAfter(textNode);
                    range.setEndAfter(textNode);
                    
                    // 5. 변경된 커서 위치를 브라우저 화면에 반영
                    selection.removeAllRanges();
                    selection.addRange(range);
                    
                    return;
                }
            }

            const selection = window.getSelection();
            const caretOffset = selection?.anchorOffset || 0;
            const fullText = currentEl.textContent||"";

            const frontText = fullText.substring(0, caretOffset);
            const backText = fullText.substring(caretOffset);

            const nextBlockId = crypto.randomUUID();
            const newBlock: EditorBlock = {
                id: nextBlockId,
                type: currentBlock.type === "heading1" || currentBlock.type === "heading2" || currentBlock.type === "blockquote" 
                ? "paragraph" // 제목이나 인용구에서 엔터치면 본문으로 스위칭 이탈 (#2, #5)
                : currentBlock.type,
                children: [{ text: backText }]
            };

            const updateBlocks = [...blocks];
            updateBlocks[index] = {...currentBlock,children:[{text:frontText}]};
            updateBlocks.splice(index+1,0,newBlock);

            updateGlobalState(updateBlocks);
            moveCaretToBlock(nextBlockId,0);
        }

        if(e.key === "Backspace"){
            const selection = window.getSelection();
            const caretOffset = selection?.anchorOffset || 0;

            if(caretOffset === 0 && index>0){
                e.preventDefault();
                const prevBlock = blocks[index - 1];
                
                // 차단/정적 블록(divider, image) 병합 제약 가드
                if (prevBlock.type === "divider" || prevBlock.type === "image") return;

                const prevBlockLastTextLength = prevBlock.children[prevBlock.children.length - 1]?.text.length || 0;
                
                // 이전 블록과 현재 블록 데이터 병합
                const mergedBlock: EditorBlock = {
                ...prevBlock,
                children: [...prevBlock.children, ...currentBlock.children]
                };

                const updatedBlocks = [...blocks];
                updatedBlocks.splice(index - 1, 2, mergedBlock);

                updateGlobalState(updatedBlocks);
                moveCaretToBlock(prevBlock.id, prevBlockLastTextLength);
            }
        }

    },[blocks, moveCaretToBlock]);

    
    const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>, blockId: string) => {
        const textContent = e.currentTarget.textContent || "";
        const updated = blocks.map((b) => {
        if (b.id !== blockId) return b;
            // 단순 구현을 위해 최상위 구조만 동기화처리, 정밀 슬라이싱용 데이터는 유지 필요
            return { ...b, children: [{...b.children[0] ,text: textContent}] };
        });
        updateGlobalState(updated);
    }, [blocks]);

    
    const handleTodoToggle = useCallback((blockId: string, checked: boolean) => {
        const updated = blocks.map((b) => {
        if (b.id !== blockId) return b;
        return {
            ...b,
            attributes: { ...b.attributes, checked },
            children: b.children.map((node) => ({ ...node, strikethrough: checked })) // 체크 시 글 전체 취소선 강제
        };
        });
        updateGlobalState(updated);
    }, [blocks]);

    const applyInlineStyle = useCallback((styleType: string) => {
    // 실제 운영 시 Selection 범위를 찾아 데이터 조각을 슬라이싱해야 함
        console.log(`Apply Inline Style: ${styleType} to selected Range`);
    }, []);

    return { blocks, handleBeforeInput, handleKeyDown, handleBlur, handleTodoToggle, applyInlineStyle };
}