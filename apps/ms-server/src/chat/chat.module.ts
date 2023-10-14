import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from '@/users/users.module';
import { SentimentsModule } from '@/sentiments/sentiments.module';
import { StatisticsModule } from '@/statistics/statistics.module';

@Module({
  imports: [UsersModule, SentimentsModule, StatisticsModule],
  providers: [ChatGateway],
})
export class ChatModule {}
