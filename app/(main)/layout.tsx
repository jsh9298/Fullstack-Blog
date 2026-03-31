import { BaseLayout } from "@/src/app/layouts";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BaseLayout>{children}</BaseLayout>;
}