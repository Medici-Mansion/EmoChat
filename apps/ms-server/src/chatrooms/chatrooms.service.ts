import { DB_MODULE } from '@/common/common.constants';
import { Repository } from '@/db/models';
import { ChatRoomModel } from '@/db/models/chat-room.model';
import { Inject, Injectable } from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { UpdateRoomDTO } from './dtos/update-room.dto';

@Injectable()
export class ChatroomsService {
  constructor(@Inject(DB_MODULE) private readonly db: Repository) {}

  async getChatRooms() {
    const chatRooms = await this.db
      .select()
      .from(ChatRoomModel)
      .orderBy(asc(ChatRoomModel.createdAt));
    return chatRooms;
  }

  async updateRoomNameById({ roomId, roomName }: UpdateRoomDTO) {
    const newRoom = await this.db
      .update(ChatRoomModel)
      .set({ roomName })
      .where(eq(ChatRoomModel.id, roomId))
      .returning();
    return newRoom[0];
  }
}
