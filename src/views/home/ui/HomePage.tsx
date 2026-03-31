import { PostCard } from "@/src/entities/post/ui/PostCard";

export const HomePage = () => (
  <main className="py-10 space-y-8">
    <h2 className="text-3xl font-bold text-center">최신 게시글</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PostCard title="FSD 시작하기" excerpt="구조를 잡는 법을 배웁니다." />
      <PostCard title="Drizzle ORM 활용" excerpt="DB 연동을 자동화합니다." />
    </div>
  </main>
);