// src/shared/lib/markdown/renderer.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import { twMerge } from "tailwind-merge";

interface RendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: RendererProps) {
  return (
    // prose 클래스는 @tailwindcss/typography 플러그인이 제공합니다.
    <div className={twMerge(
      "prose prose-slate dark:prose-invert max-w-none",
      "prose-headings:scroll-mt-20", // TOC 클릭 이동 시 헤더에 가려지지 않게 여백
      "prose-pre:bg-[#1e1e1e] prose-pre:p-0", // 코드 블록 배경 및 패딩 설정
      className
    )}>
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [
              remarkGfm,  // 표, 체크리스트 등
              remarkMath, // 수식 파싱
            ],
            rehypePlugins: [
              rehypeSlug,   // h1~h6에 id 자동 부여 (TOC 연동 핵심)
              rehypeKatex,  // 수식을 HTML로 렌더링
              [
                rehypePrettyCode, // 코드 하이라이팅
                {
                  theme: "github-dark",
                  keepBackground: true,
                },
              ],
            ],
            format: "mdx",
          },
          parseFrontmatter: true,
        }}
      />
    </div>
  );
}