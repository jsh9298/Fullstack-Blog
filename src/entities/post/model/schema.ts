import { pgTable, serial, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).unique().notNull(), // URL 주소 (예: my-first-post)
  title: varchar("title", { length: 255 }).notNull(),        // 글 제목
  description: text("description"),                          // 요약 (SEO용)
  content: text("content").notNull(),                        // MDX 본문 (Raw String)
  category: varchar("category", { length: 50 }),             // 카테고리
  thumbnail: text("thumbnail"),                              // 썸네일 이미지 URL
  published: boolean("published").default(false),            // 임시저장/공개 여부
  views: integer("views").default(0),                        // 조회수
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});