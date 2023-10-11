import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { CoreModel } from './core.model';
import { relations } from 'drizzle-orm';
import { FontModel } from './font.model';
import { EmotionModel } from './emotion.model';
import { SentimentModel } from './sentiment.model';

export const FontMappingModel = pgTable('fontToEmotion', {
  ...CoreModel,
  fontId: uuid('fontId').references(() => FontModel.id),
  emotionId: uuid('emotionId').references(() => EmotionModel.id),
  sentimentId: uuid('sentimentId').references(() => SentimentModel.id),
});

export const FontMappingRelations = relations(FontMappingModel, ({ one }) => ({
  font: one(FontModel, {
    fields: [FontMappingModel.fontId],
    references: [FontModel.id],
  }),
  emotion: one(EmotionModel, {
    fields: [FontMappingRelations.emotionId],
    references: [EmotionModel.id],
  }),
  sentiment: one(SentimentModel, {
    fields: [FontMappingModel.fontId],
    references: [SentimentModel.id],
  }),
}));

export default { FontMappingModel, FontMappingRelations };
