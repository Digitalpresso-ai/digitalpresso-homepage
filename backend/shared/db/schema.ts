import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  title_en: text('title_en').notNull().default(''),
  title_ja: text('title_ja').notNull().default(''),
  content: text('content').notNull().default(''),
  content_en: text('content_en').notNull().default(''),
  content_ja: text('content_ja').notNull().default(''),
  cover_img_url: text('cover_img_url'),
  category: text('category').notNull().default('company'),
  // 'draft' = 임시저장(공개 안 됨), 'published' = 실서버 게시
  status: text('status').notNull().default('draft'),
  published_at: timestamp('published_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const articleImages = pgTable('article_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  article_id: uuid('article_id').references(() => articles.id, { onDelete: 'cascade' }),
  image_url: text('image_url').notNull(),
  alt: text('alt'),
  width: integer('width'),
  height: integer('height'),
  caption: text('caption'),
  sort_order: integer('sort_order').notNull().default(0),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const articlesRelations = relations(articles, ({ many }) => ({
  images: many(articleImages),
}));

export const articleImagesRelations = relations(articleImages, ({ one }) => ({
  article: one(articles, {
    fields: [articleImages.article_id],
    references: [articles.id],
  }),
}));
