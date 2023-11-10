import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { CoreModel } from './core.model';
import { relations } from 'drizzle-orm';
import { MessageModel } from './message.model';

export const ChatRoomModel = pgTable('chatRoom', {
  ...CoreModel,
  roomName: text('roomName'),
  category: text('category'),
  displayName: text('displayName'),
  maxUserCount: integer('maxUserCount'),
});

export const ChatRoomModelRelations = relations(ChatRoomModel, ({ many }) => ({
  message: many(MessageModel),
}));

export default {
  ChatRoomModel,
  ChatRoomModelRelations,
};
