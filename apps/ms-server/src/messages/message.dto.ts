import { faceExpressions } from '@/chat/dtos/message.dto';

export class CreateMessageDto {
  userId: string;
  emotionTitle: string;
  text: string;
  mappingId?: string;
  roomId: string;
  roomName: string;
  nickName: string;
  others?: faceExpressions;
}
