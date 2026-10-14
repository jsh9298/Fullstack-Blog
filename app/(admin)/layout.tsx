
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
       <p>작성중..</p>
      <main className="flex-1 bg-bg-l2 p-10">{children}</main>
    </div>
  );
}
