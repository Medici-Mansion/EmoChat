export class faceExpressions {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}

export class SendMessageDto {
  roomId: string;
  userId?: string;
  message: string;
  emotion: string;
  ratio: number;
  sentiment?: string;
  others?: faceExpressions;
}
