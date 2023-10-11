import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { CoreModel } from './core.model';
import { relations } from 'drizzle-orm';
import { FontMappingModel } from './font-mapping.model';

export const MessageModel = pgTable('message', {
  ...CoreModel,
  text: text('text'),
  emotion: text('emotion'),
  nickname: text('nickname'),
  room: text('room'),
  fontToEmotionId: uuid('fontToEmotionId').references(
    () => FontMappingModel.id,
  ),
});

export const MessageModelRelations = relations(MessageModel, ({ one }) => ({
  fontToEmotion: one(FontMappingModel, {
    fields: [MessageModel.fontToEmotionId],
    references: [FontMappingModel.id],
  }),
}));

export default {
  MessageModel,
  MessageModelRelations,
};
