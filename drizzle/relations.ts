import { relations } from "drizzle-orm/relations";
import { articles, articleImages } from "./schema";

export const articleImagesRelations = relations(articleImages, ({one}) => ({
	article: one(articles, {
		fields: [articleImages.articleId],
		references: [articles.id]
	}),
}));

export const articlesRelations = relations(articles, ({many}) => ({
	articleImages: many(articleImages),
}));