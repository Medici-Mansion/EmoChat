import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from '@/users/users.module';
import { SentimentsModule } from '@/sentiments/sentiments.module';

@Module({
  imports: [UsersModule, SentimentsModule],
  providers: [ChatGateway],
})
export class ChatModule {}
