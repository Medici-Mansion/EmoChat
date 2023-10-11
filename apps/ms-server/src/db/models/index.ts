import Message from '@/db/models/message.model';
import Emotion from '@/db/models/emotion.model';
import FontMapping from '@/db/models/font-mapping.model';
import Sentiment from '@/db/models/sentiment.model';
import Font from '@/db/models/font.model';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export const schema = {
  ...Message,
  ...Emotion,
  ...FontMapping,
  ...Sentiment,
  ...Font,
};
export type DBMoudle = NodePgDatabase<typeof schema>;
