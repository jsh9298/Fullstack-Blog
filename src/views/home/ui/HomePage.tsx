'use client';
import { useState } from "react";
import { PostCard } from "@/src/entities/post/ui/PostCard";
import { Button, InputText ,TextArea } from "@/src/shared/ui"
import { BaseOverlay,SlidePanel,Badge,Typography } from "@/src/shared/ui";


export const HomePage = () => {

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  return (
  <main className="max-w-5xl mx-auto py-10 px-4 space-y-16">
   
    <section className="text-center space-y-4">
      <h2 className="text-4xl font-black text-text-main">테스트</h2>
      <p className="text-text-sub">공통 컴포넌트 스타일 점검.</p>
    </section>

    <section className="space-y-6">
      <h3 className="text-2xl font-bold border-b pb-2">1. Actions (Buttons)</h3>
      <div className="flex flex-wrap gap-4 items-center">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </section>

    
    <section className="space-y-6">
      <h3 className="text-2xl font-bold border-b pb-2">2. Data Entry</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <InputText label="이메일" placeholder="example@test.com" />
          <InputText label="비밀번호" type="password" error="비밀번호가 일치하지 않습니다." />
        </div>
        <TextArea label="자기소개" placeholder="내용을 입력해주세요." />
      </div>
    </section>

    <section className="space-y-6">
      <h3 className="text-2xl font-bold border-b pb-2">3. Display (Post Cards)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PostCard 
          title="FSD 시작하기" 
          excerpt="Feature-Sliced Design 구조를 통해 프로젝트의 확장성을 확보하는 방법을 실습합니다." 
        />
        <PostCard 
          title="Drizzle ORM 활용" 
          excerpt="Typescript 환경에서 SQL을 안전하게 작성하고 DB 연동을 자동화하는 기술을 배웁니다." 
        />
      </div>
    </section>

    <section className="space-y-6">
      <h3 className="text-2xl font-bold border-b pb-2">4. Typography & Badges</h3>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="error">Error</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="info">Info</Badge>
        </div>
        <div className="space-y-2">
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="body">
            Typography 컴포넌트를 사용한 본문 텍스트 예시입니다. 일관된 폰트 스타일과 간격을 유지합니다.
          </Typography>
          <Typography variant="caption">
            * Typography의 caption 변형입니다. 보조 텍스트에 사용합니다.
          </Typography>
        </div>
      </div>
    </section>

    <section className="space-y-6">
      <h3 className="text-2xl font-bold border-b pb-2">5. Overlays & Panels</h3>
      <div className="flex gap-4">
        <Button onClick={() => setIsOverlayOpen(true)}>Open Overlay</Button>
        <Button variant="outline" onClick={() => setIsPanelOpen(true)}>Open Slide Panel</Button>
      </div>

      <BaseOverlay isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)}>
        <div className="bg-bg-l1 p-6 rounded-xl shadow-xl max-w-sm w-full border border-border-main">
          <Typography variant="h3" className="mb-4">모달 오버레이</Typography>
          <Typography variant="body" className="mb-6 text-text-sub">BaseOverlay를 사용하여 배경을 흐리게 처리하고 중앙에 콘텐츠를 배치합니다.</Typography>
          <Button className="w-full" onClick={() => setIsOverlayOpen(false)}>닫기</Button>
        </div>
      </BaseOverlay>

      <SlidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)}>
        <div className="space-y-6">
          <Typography variant="body">SlidePanel은 우측에서 나타나는 사이드바 형태의 UI입니다.</Typography>
          <InputText label="사용자 별명" placeholder="입력하세요..." />
          <Button className="w-full" onClick={() => setIsPanelOpen(false)}>저장하기</Button>
        </div>
      </SlidePanel>
    </section>

  </main>);
};

