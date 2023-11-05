import { DB_MODULE } from '@/common/common.constants';
import { Repository } from '@/db/models';
import { ChatRoomModel } from '@/db/models/chat-room.model';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ChatroomsService {
  constructor(@Inject(DB_MODULE) private readonly db: Repository) {}

  async getChatRooms() {
    const chatRooms = await this.db.select().from(ChatRoomModel);
    return chatRooms;
  }
}
