import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { CoreModel } from './core.model';
import { relations } from 'drizzle-orm';
import { FontMappingModel } from './font-mapping.model';

export const FontModel = pgTable('font', {
  ...CoreModel,
  name: text('name'),
  alias: text('alias'),
  code: integer('code'),
});

export const FontModelRelations = relations(FontModel, ({ many }) => ({
  fontToEmotion: many(FontMappingModel),
}));

export default { FontModel, FontModelRelations };
