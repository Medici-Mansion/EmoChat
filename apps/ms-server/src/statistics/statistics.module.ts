import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsListener } from './listeners/statistics.listeners';
import { UsersModule } from '@/users/users.module';
import { MessagesModule } from '@/messages/messages.module';

@Module({
  imports: [UsersModule, MessagesModule],
  providers: [StatisticsService, StatisticsListener],
  exports: [StatisticsListener],
})
export class StatisticsModule {}
