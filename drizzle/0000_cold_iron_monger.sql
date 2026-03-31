CREATE TABLE "site_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_name" text DEFAULT 'My CMS Blog',
	"active_skin_id" text DEFAULT 'default',
	"appearance" jsonb DEFAULT '{"primaryColor":"#3b82f6"}'::jsonb
);
