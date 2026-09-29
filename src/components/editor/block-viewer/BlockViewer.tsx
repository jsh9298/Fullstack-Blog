import type { EditorBlock } from "@/src/components/editor/editor-core/model/types";
import { getSingletonHighlighter } from "shiki";

interface BlockViewerProps {
  blocks: EditorBlock[];
}

export async function BlockViewer({ blocks }: BlockViewerProps) {
  if (!blocks || blocks.length === 0) return <p className="text-gray-400">등록된 본문 내용이 없습니다.</p>;

  // 서버 컴포넌트(RSC) 영역이므로 싱글톤 인스턴스 고속 싱크 가능
  const highlighter = await getSingletonHighlighter({
    themes: ["github-dark"],
    langs: ["typescript", "javascript", "tsx", "html", "css", "json", "markdown"],
  });

  return (
    // @tailwindcss/typography 플러그인이 내포하는 'prose' 스타일 강제 지정 효과 부여
    <article className="prose max-w-none dark:prose-invert prose-slate select-text">
      {blocks.map((block) => {
        
        // 1. 정적 구분선 변환
        if (block.type === "divider") {
          return <hr key={block.id} className="my-6 border-t border-gray-200" />;
        }

        // 2. 정적 이미지 레이아웃 변환
        if (block.type === "image") {
          return (
            <figure key={block.id} className="my-4">
              <img src={block.attributes?.url} alt="CMS Media Record" className="rounded-xl border border-gray-100 max-w-full h-auto" />
              {block.attributes?.caption && <figcaption className="text-center text-xs text-gray-400 italic mt-2">{block.attributes.caption}</figcaption>}
            </figure>
          );
        }

        // 3. ⭐️ 서버 타임 Shiki 하이라이팅 완결 코드 블록 변환
        if (block.type === "codeblock") {
          const rawCode = block.children[0]?.text || "";
          const lang = block.attributes?.language || "typescript";
          
          // 빌드/서버 타임에 완성형 하이라이팅 HTML 추출
          const highlightedHtml = highlighter.codeToHtml(rawCode, {
            lang,
            theme: "github-dark",
          });

          return (
            <div 
              key={block.id} 
              className="shiki-code-wrapper rounded-xl overflow-hidden my-4 text-sm"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }} // 클라이언트는 파싱 연산 부담 없이 HTML만 렌더링
            />
          );
        }

        // 4. 리스트 컴포넌트 변환 구조 맵핑
        if (block.type === "bulleted-list-item") {
          return (
            <ul key={block.id} className="my-1">
              <li>{renderInlineText(block.children)}</li>
            </ul>
          );
        }

        if (block.type === "numbered-list-item") {
          return (
            <ol key={block.id} className="my-1">
              <li>{renderInlineText(block.children)}</li>
            </ol>
          );
        }

        // 5. 할 일 목록 정적 변환
        if (block.type === "todo-list-item") {
          return (
            <div key={block.id} className="flex items-center gap-2 my-1 text-gray-700">
              <input type="checkbox" checked={block.attributes?.checked || false} disabled className="rounded border-gray-300" />
              <span className={block.attributes?.checked ? "line-through text-gray-400" : ""}>{renderInlineText(block.children)}</span>
            </div>
          );
        }

        // 6. 기본 표준 태그 그룹 매핑 (heading1~3, blockquote, paragraph)
        switch (block.type) {
          case "heading1": return <h1 key={block.id} className="text-3xl font-bold mt-8 mb-4">{renderInlineText(block.children)}</h1>;
          case "heading2": return <h2 key={block.id} className="text-2xl font-semibold mt-6 mb-3">{renderInlineText(block.children)}</h2>;
          case "heading3": return <h3 key={block.id} className="text-xl font-medium mt-4 mb-2">{renderInlineText(block.children)}</h3>;
          case "blockquote": return <blockquote key={block.id} className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">{renderInlineText(block.children)}</blockquote>;
          default: return <p key={block.id} className="leading-relaxed my-2">{renderInlineText(block.children)}</p>;
        }
      })}
    </article>
  );
}

/**
 * 인라인 요소 노드들을 정적 순수 JSX 스타일 노드로 변환하는 서버 헬퍼 유틸
 */
function renderInlineText(nodes: EditorBlock["children"]) {
  return nodes.map((node, i) => {
    let element: React.ReactNode = node.text;

    if (node.bold) element = <strong className="font-bold">{element}</strong>;
    if (node.italic) element = <em className="italic">{element}</em>;
    if (node.underline) element = <u className="underline">{element}</u>;
    if (node.strikethrough) element = <del className="line-through">{element}</del>;
    if (node.isInlineCode) element = <code className="bg-gray-100 text-red-500 px-1 py-0.5 rounded text-xs font-mono">{element}</code>;
    if (node.linkUrl && !node.isInlineCode) {
      element = (
        <a href={node.linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-600">
          {element}
        </a>
      );
    }

    return <span key={i}>{element}</span>;
  });
}
