import { Card } from "@/src/shared/ui/Display/card";
import { Button } from "@/src/shared/ui/Actions/button";

export const PostCard = ({ title, excerpt }: { title: string; excerpt: string }) => (
  <Card className="hover:shadow-lg transition-all duration-300">
    <Card.Header>
      <h3 className="text-xl font-bold">{title}</h3>
    </Card.Header>
    <Card.Content>
      <p className="text-text-sub mt-2 line-clamp-3">{excerpt}</p>
    </Card.Content>
    <Card.Footer className="flex justify-end">
      <Button variant="ghost" size="sm">자세히 보기</Button>
    </Card.Footer>
  </Card>
);