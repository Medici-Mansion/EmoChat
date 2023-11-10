import { DB_MODULE } from '@/common/common.constants';
import { Repository } from '@/db/models';
import { MessageModel } from '@/db/models/message.model';
import { Inject, Injectable } from '@nestjs/common';
import { InferInsertModel } from 'drizzle-orm';

@Injectable()
export class MessagesService {
  constructor(@Inject(DB_MODULE) private readonly db: Repository) {}

  async createMessage(createMessageDto: InferInsertModel<typeof MessageModel>) {
    const message = await this.db
      .insert(MessageModel)
      .values([createMessageDto])
      .returning();

    return message[0];
  }
}
