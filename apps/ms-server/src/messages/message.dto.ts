import { faceExpressions } from '@/chat/dtos/message.dto';

export class CreateMessageDto {
  emotionTitle: string;
  text: string;
  mappingId: string;
  room: string;
  nickName: string;
  others?: faceExpressions;
}
