import { Module } from '@nestjs/common';

import { DbModule } from './db/db.module';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { SentimentsModule } from './sentiments/sentiments.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [DbModule, ChatModule, UsersModule, SentimentsModule, StatisticsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
