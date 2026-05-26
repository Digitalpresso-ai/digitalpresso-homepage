import { pgTable, index, pgPolicy, uuid, text, timestamp, foreignKey, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const articles = pgTable("articles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	titleEn: text("title_en").default(').notNull(),
	titleJa: text("title_ja").default(').notNull(),
	content: text().default(').notNull(),
	contentEn: text("content_en").default(').notNull(),
	contentJa: text("content_ja").default(').notNull(),
	coverImgUrl: text("cover_img_url"),
	category: text().default('company').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("articles_category_idx").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("articles_created_at_idx").using("btree", table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	pgPolicy("Public can read articles", { as: "permissive", for: "select", to: ["anon"], using: sql`true` }),
	pgPolicy("Authenticated users can manage articles", { as: "permissive", for: "all", to: ["authenticated"] }),
]);

export const articleImages = pgTable("article_images", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	articleId: uuid("article_id"),
	imageUrl: text("image_url").notNull(),
	alt: text(),
	width: integer(),
	height: integer(),
	caption: text(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("article_images_article_id_idx").using("btree", table.articleId.asc().nullsLast().op("uuid_ops")),
	index("article_images_sort_order_idx").using("btree", table.articleId.asc().nullsLast().op("int4_ops"), table.sortOrder.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.articleId],
			foreignColumns: [articles.id],
			name: "article_images_article_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Authenticated users can manage article_images", { as: "permissive", for: "all", to: ["authenticated"], using: sql`true`, withCheck: sql`true`  }),
]);
