import { Sidebar } from "@/src/widgets/admin-env/ui/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-10">{children}</main>
    </div>
  );
}