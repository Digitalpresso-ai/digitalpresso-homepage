-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"title_en" text DEFAULT '' NOT NULL,
	"title_ja" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"content_en" text DEFAULT '' NOT NULL,
	"content_ja" text DEFAULT '' NOT NULL,
	"cover_img_url" text,
	"category" text DEFAULT 'company' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "articles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "article_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid,
	"image_url" text NOT NULL,
	"alt" text,
	"width" integer,
	"height" integer,
	"caption" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "article_images" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "article_images" ADD CONSTRAINT "article_images_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category" text_ops);--> statement-breakpoint
CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "article_images_article_id_idx" ON "article_images" USING btree ("article_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "article_images_sort_order_idx" ON "article_images" USING btree ("article_id" int4_ops,"sort_order" int4_ops);--> statement-breakpoint
CREATE POLICY "Public can read articles" ON "articles" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can manage articles" ON "articles" AS PERMISSIVE FOR ALL TO "authenticated";--> statement-breakpoint
CREATE POLICY "Authenticated users can manage article_images" ON "article_images" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);
*/