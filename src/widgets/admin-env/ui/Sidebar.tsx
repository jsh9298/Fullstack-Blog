export const Sidebar = () => (
  <aside className="w-64 bg-zinc-900 text-zinc-400 p-6 min-h-screen">
    <div className="text-white font-bold text-xl mb-10">Admin Panel</div>
    <nav className="space-y-6">
      <div className="cursor-pointer hover:text-white transition">대시보드</div>
      <div className="cursor-pointer hover:text-white transition">글 관리</div>
      <div className="cursor-pointer hover:text-white transition">스킨/테마 설정</div>
    </nav>
  </aside>
);