import { pgTable, text } from 'drizzle-orm/pg-core';
import { CoreModel } from './core.model';
import { FontMappingModel } from './font-mapping.model';
import { relations } from 'drizzle-orm';

export const SentimentModel = pgTable('sentiment', {
  ...CoreModel,
  name: text('name'),
});

export const SentimentModelRelations = relations(
  SentimentModel,
  ({ many }) => ({
    fontToEmotion: many(FontMappingModel),
  }),
);

export default { SentimentModel, SentimentModelRelations };
