CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"category" varchar(50),
	"thumbnail" text,
	"published" boolean DEFAULT false,
	"views" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
