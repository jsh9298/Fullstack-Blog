import type { EditorBlock } from "@/src/entities/editor-core/model/types";
import { InlineRenderer } from "./InlineRenderer";

interface BlockNodeProps {
    block: EditorBlock;
    onBeforeInput: (e:React.InputEvent<HTMLDivElement>, id:string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, id: string) => void;
    onBlur: (e: React.FocusEvent<HTMLDivElement>, id: string) => void;
    onTodoToggle?: (id: string, checked: boolean) => void;
}

export function BlockNode({block,onBeforeInput,onKeyDown,onBlur,onTodoToggle}: BlockNodeProps) {
  // 구분선
  if (block.type === "divider") {
    return (
      <div 
        data-block-id={block.id}
        className="py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 group relative"
        tabIndex={0} // 포커스는 가능하게 하여 삭제(Delete) 이벤트 수용
        onKeyDown={(e) => onKeyDown(e as any, block.id)}
      >
        <hr className="border-t-2 border-gray-200 pointer-events-none" />
      </div>
    );
  }

  // 이미지 / 미디어 
  if (block.type === "image") {
    return (
      <div data-block-id={block.id} className="my-4 group relative focus:outline-none">
        <div className="relative overflow-hidden rounded-lg border border-gray-200 max-w-xl">
          <img src={block.attributes?.url || "/placeholder.png"} alt="CMS Media Resource" className="w-full h-auto object-cover" />
        </div>
        {/* 부분 제한 영역: 하위 캡션 편집창 독립 제공 */}
        <div 
          contentEditable
          suppressContentEditableWarning
          className="mt-1.5 text-xs text-gray-500 outline-none italic empty:before:content-['캡션_입력...'] before:text-gray-300"
          onBlur={(e) => onBlur(e as any, block.id)} // 캡션 데이터 반영 타겟팅 필요
        >
          {block.attributes?.caption}
        </div>
      </div>
    );
  }

  //  코드 블록 (수동 인라인 서식 차단, 단일 string 문자열 가이드)
  if (block.type === "codeblock") {
    return (
      <div className="my-3 font-mono text-sm relative bg-gray-900 text-gray-100 rounded-lg p-4">
        <div className="absolute top-2 right-3 text-xs text-gray-500 uppercase select-none">{block.attributes?.language || "plain"}</div>
        <pre className="overflow-x-auto whitespace-pre-wrap">
          <code
            data-block-id={block.id}
            contentEditable
            suppressContentEditableWarning
            className="outline-none block w-full h-full"
            onKeyDown={(e) => onKeyDown(e as any, block.id)}
            onBlur={(e) => onBlur(e as any, block.id)}
          >
            {block.children[0]?.text || ""}
          </code>
        </pre>
      </div>
    );
  }

  // 할 일 목록 (체크박스 토글 연동형 특수 가이드 컴포넌트)
  if (block.type === "todo-list-item") {
    return (
      <div className="flex items-start gap-2.5 my-1 group">
        <input
          type="checkbox"
          checked={block.attributes?.checked || false}
          onChange={(e) => onTodoToggle?.(block.id, e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
        />
        <div
          data-block-id={block.id}
          contentEditable
          suppressContentEditableWarning
          className="flex-1 outline-none text-gray-800"
          onBeforeInput={(e) => onBeforeInput(e, block.id)}
          onKeyDown={(e) => onKeyDown(e, block.id)}
          onBlur={(e) => onBlur(e, block.id)}
        >
          <InlineRenderer nodes={block.children} />
        </div>
      </div>
    );
  }

  // 공통 처리 그룹 (paragraph, heading1~3, blockquote, list 등)
  const getTagStyles = () => {
    switch (block.type) {
      case "heading1": return "text-3xl font-bold tracking-tight text-gray-900 mt-6 mb-2";
      case "heading2": return "text-2xl font-semibold tracking-tight text-gray-800 mt-4 mb-1.5";
      case "heading3": return "text-xl font-medium tracking-tight text-gray-800 mt-3 mb-1";
      case "blockquote": return "pl-4 border-l-4 border-gray-300 text-gray-600 italic my-2";
      case "bulleted-list-item": return "list-disc pl-5 my-0.5 text-gray-800 before:content-['•'] before:mr-2 before:text-gray-400";
      case "numbered-list-item": return "list-decimal pl-5 my-0.5 text-gray-800";
      default: return "text-base text-gray-800 my-1 min-h-[1.5rem]";
    }
  };

  return (
    <div
      data-block-id={block.id}
      contentEditable
      suppressContentEditableWarning
      className={`outline-none transition-all duration-150 ${getTagStyles()}`}
      onBeforeInput={(e) => onBeforeInput(e, block.id)}
      onKeyDown={(e) => onKeyDown(e, block.id)}
      onBlur={(e) => onBlur(e, block.id)}
    >
      <InlineRenderer nodes={block.children} />
    </div>
  );
}