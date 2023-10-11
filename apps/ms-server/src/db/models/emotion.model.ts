import { pgTable, text } from 'drizzle-orm/pg-core';
import { CoreModel } from './core.model';
import { relations } from 'drizzle-orm';
import { FontMappingModel } from './font-mapping.model';

export const EmotionModel = pgTable('emotion', {
  ...CoreModel,
  name: text('name'),
});
const EmotionModelRelations = relations(EmotionModel, ({ many }) => ({
  fontToEmotion: many(FontMappingModel),
}));

export default { EmotionModel, EmotionModelRelations };
