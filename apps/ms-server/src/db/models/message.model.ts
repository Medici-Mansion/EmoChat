import { doublePrecision, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { CoreModel } from './core.model';
import { relations } from 'drizzle-orm';
import { FontMappingModel } from './font-mapping.model';
import { UserModel } from './user.model';

export const MessageModel = pgTable('message', {
  ...CoreModel,
  text: text('text'),
  emotion: text('emotion'),
  nickname: text('nickname'),
  room: text('room'),
  neutral: doublePrecision('neutral'),
  happy: doublePrecision('happy'),
  sad: doublePrecision('sad'),
  angry: doublePrecision('angry'),
  fearful: doublePrecision('fearful'),
  disgusted: doublePrecision('disgusted'),
  surprised: doublePrecision('surprised'),

  userId: uuid('userId').references(() => UserModel.id),
  fontToEmotionId: uuid('fontToEmotionId').references(
    () => FontMappingModel.id,
  ),
});

export const MessageModelRelations = relations(MessageModel, ({ one }) => ({
  fontToEmotion: one(FontMappingModel, {
    fields: [MessageModel.fontToEmotionId],
    references: [FontMappingModel.id],
  }),
  userId: one(UserModel, {
    fields: [MessageModel.userId],
    references: [UserModel.id],
  }),
}));

export default {
  MessageModel,
  MessageModelRelations,
};
