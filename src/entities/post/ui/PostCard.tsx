import { Card } from "@/src/shared/ui/card";

export const PostCard = ({ title, excerpt }: { title: string; excerpt: string }) => (
  <Card className="p-4 hover:shadow-lg transition">
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-gray-500 mt-2">{excerpt}</p>
  </Card>
);