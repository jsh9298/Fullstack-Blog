import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";

export const siteConfigs = pgTable("site_configs", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").default("My CMS Blog"),
  activeSkinId: text("active_skin_id").default("default"),
  appearance: jsonb("appearance").default({ primaryColor: "#3b82f6" }),
});