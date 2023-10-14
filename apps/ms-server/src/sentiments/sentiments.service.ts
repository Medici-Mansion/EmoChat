import { DB_MODULE } from '@/common/common.constants';
import { Repository } from '@/db/models';
import { EmotionModel } from '@/db/models/emotion.model';
import { FontMappingModel } from '@/db/models/font-mapping.model';
import { SentimentModel } from '@/db/models/sentiment.model';

import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class SentimentsService {
  constructor(@Inject(DB_MODULE) private readonly db: Repository) {}

  async getSentimentsByEmotion(emotion: string) {
    const getEmotionSq = this.db
      .select()
      .from(EmotionModel)
      .where(eq(EmotionModel.title, emotion))
      .as('e');
    const result = await this.db
      .select({
        id: SentimentModel.id,
        name: SentimentModel.name,
      })
      .from(FontMappingModel)
      .innerJoin(getEmotionSq, eq(FontMappingModel.emotionId, getEmotionSq.id))
      .innerJoin(
        SentimentModel,
        eq(FontMappingModel.sentimentId, SentimentModel.id),
      );

    return result;
  }
  async getFontByEmotionAndSentiment(emotion: string, sentimentId: string) {
    const getEmotionSq = this.db
      .select()
      .from(EmotionModel)
      .where(eq(EmotionModel.title, emotion))
      .as('e');
    const result = await this.db
      .select({
        id: SentimentModel.id,
        name: SentimentModel.name,
      })
      .from(FontMappingModel)
      .innerJoin(getEmotionSq, eq(FontMappingModel.emotionId, getEmotionSq.id))
      .innerJoin(
        SentimentModel,
        eq(FontMappingModel.sentimentId, SentimentModel.id),
      );

    return result;
  }
}
