import { uuid, timestamp } from 'drizzle-orm/pg-core';
export const CoreModel = {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('createdAt').defaultNow(),
};
