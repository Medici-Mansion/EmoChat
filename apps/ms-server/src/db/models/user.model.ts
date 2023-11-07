import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { CoreModel } from './core.model';
import { relations } from 'drizzle-orm';
import { MessageModel } from './message.model';

export const UserModel = pgTable('users', {
  ...CoreModel,
  nickname: text('nickname'),
  avatar: text('avatar').default('0'),
  isDefaultAvatar: boolean('is_default_avatar').default(true),
});

export const UserModelRelations = relations(UserModel, ({ many }) => ({
  message: many(MessageModel),
}));

export default {
  UserModel,
  UserModelRelations,
};
