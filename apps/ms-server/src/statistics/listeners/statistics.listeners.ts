import { MessagesService } from './../../messages/messages.service';
import { UsersService } from '@/users/users.service';
import { CreateMessageDto } from '@/messages/message.dto';
import { Injectable } from '@nestjs/common';
import { OnSafeEvent } from '../decorator/on-safe-event.decorator';

@Injectable()
export class StatisticsListener {
  constructor(
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
  ) {}

  @OnSafeEvent('message.created')
  async handleMessageCreatedEvent(event: CreateMessageDto) {
    try {
      const {
        nickName,
        emotionTitle,
        mappingId,
        roomName,
        roomId,
        text,
        others,
      } = event;
      const user = await this.usersService.findUserByNickName(nickName);
      await this.messagesService.createMessage({
        userId: user?.id,
        text,
        roomId,
        room: roomName,
        nickname: nickName,
        emotion: emotionTitle,
        fontToEmotionId: mappingId,
        ...others,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
