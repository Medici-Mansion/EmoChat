import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from '@/users/users.module';
import { SentimentsModule } from '@/sentiments/sentiments.module';
import { StatisticsModule } from '@/statistics/statistics.module';
import { ChatroomsModule } from '@/chatrooms/chatrooms.module';

@Module({
  imports: [UsersModule, SentimentsModule, ChatroomsModule, StatisticsModule],
  providers: [ChatGateway],
})
export class ChatModule {}
