// src/app/page.tsx
"use client";

import { useState } from "react";
// import dynamic from "next/dynamic";
import type { EditorBlock } from "@/src/entities/editor-core/model/types";
import { BlockViewer } from "@/src/shared";

// 🚨 [FSD 가이드] 무거운 브라우저 전용 런타임을 가진 에디터들은 SSR을 비활성화하여 dynamic 로드합니다.
// const BlockEditor = dynamic(
//   () => import("@/src/shared/ui/block-editor/BlockEditor").then((mod) => mod.BlockEditor),  
//   { ssr: false }
// );
// const CodeEditor = dynamic(
//   () => import("@/src/shared/ui/code-editer/CodeEditor").then((mod) => mod.CodeEditor),
//   { ssr: false }
// );

import { BlockEditor } from "@/src/shared";
import { CodeEditor } from "@/src/shared";
export default function GlobalSandboxPage() {
  // 🗂️ 1. 블록 에디터용 테스트 더미 데이터 상태
  const [blogBlocks, setBlogBlocks] = useState<EditorBlock[]>([
    { id: "b1", type: "heading1", children: [{ text: "🚀 CMS 코어 인프라 샌드박스 테스트" }] },
    { id: "b2", type: "paragraph", children: [{ text: "노션 스타일 블록 에디터와 코드 에디터가 정상 작동하는지 테스트합니다. 빈 줄에서 마크다운 패턴(# , ## , > , [] , ```)을 입력하고 스페이스바를 누르거나, 글자를 마우스 드래그해 보세요." }] },
    { id: "b3", type: "todo-list-item", children: [{ text: "할 일 목록 체크박스 연동 및 취소선 특수 규칙 테스트" }], attributes: { checked: false } }
  ]);

  // 💻 2. 코드 에디터용 테스트 스킨 소스코드 상태
  const [skinHtml, setSkinHtml] = useState<string>(
`<div class="custom-skin-preview">
  <h1>{{ site_name }}에 오신 것을 환영합니다!</h1>
  <p>이곳은 관리자가 직접 코딩한 커스텀 HTML/CSS로 렌더링되는 영역입니다.</p>
</div>`
  );

  return (
    <div className="w-full min-h-screen bg-gray-50/50 pb-24">
      {/* 랜드마크 헤더 */}
      <header className="w-full bg-white border-b border-gray-200 px-8 py-5 mb-8 shadow-xs">
        <h1 className="text-xl font-mono font-black text-gray-900 tracking-tight">
          All-in-One CMS Platform Core Testbed (v2026)
        </h1>
        <p className="text-xs text-gray-500 font-mono mt-1">Node v22 LTS · Next 16 · React 19 · Tailwind v4</p>
      </header>

      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ====================  LEFT PANEL: EDITORS ==================== */}
        <div className="flex flex-col gap-8">
          
          {/* 섹션 1: 일반 유저 및 공지사항 기고용 [블록 에디터] */}
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-mono font-bold text-gray-700 bg-gray-200/60 px-3 py-1 rounded w-fit">
              #01. Notion-style Block Editor
            </h2>
            <BlockEditor 
              initialBlocks={blogBlocks} 
              onChange={(updated) => setBlogBlocks(updated)} 
            />
          </section>

          {/* 섹션 2: 개발자용 스킨/테마 빌딩 [코드 에디터] */}
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-mono font-bold text-gray-700 bg-gray-200/60 px-3 py-1 rounded w-fit">
              #02. Skin Developer Code Editor
            </h2>
            <CodeEditor
              value={skinHtml}
              onChange={(code) => setSkinHtml(code)}
              language="html"
              height="350px"
              placeholder="<!-- 스킨 소스코드를 수정해 보세요 -->"
            />
          </section>
        </div>

        {/* ==================== RIGHT PANEL: REALTIME VIEWERS ==================== */}
        <div className="flex flex-col gap-8">
          
          {/* 섹션 3: 블록 에디터 데이터 전송 결과 [정적 뷰어 (RSC 모사)] */}
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-mono font-bold text-red-700 bg-red-50 px-3 py-1 rounded w-fit border border-red-100">
              #03. High-Performance Static Viewer Output
            </h2>
            <div className="w-full border border-gray-200 rounded-xl bg-white p-8 shadow-xs min-h-[400px]">
              {/* 💡 실제 운영 환경에선 DB에서 블록 JSON을 꺼내와 서버 컴포넌트(RSC)에서 정적으로 굽게 됩니다 */}
              <BlockViewer blocks={blogBlocks} />
            </div>
          </section>

          {/* 섹션 4: 관리자 코드 에디터 변경 내역 데이터 로우 스트림 감지 */}
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded w-fit border border-blue-100">
              #04. Realtime CMS State Logger (Raw JSON)
            </h2>
            <div className="w-full border border-gray-200 rounded-xl bg-gray-900 p-5 shadow-xs h-[350px] overflow-y-auto">
              <pre className="text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre-wrap">
                {JSON.stringify({ 
                  active_blocks_count: blogBlocks.length,
                  skin_code_length: skinHtml.length,
                  editor_state_snapshot: blogBlocks 
                }, null, 2)}
              </pre>
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}
