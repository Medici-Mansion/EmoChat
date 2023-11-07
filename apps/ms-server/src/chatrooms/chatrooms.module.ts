import { Module } from '@nestjs/common';
import { ChatroomsService } from './chatrooms.service';
import { DbModule } from '@/db/db.module';

@Module({
  imports: [DbModule],
  providers: [ChatroomsService],
  exports: [ChatroomsService],
})
export class ChatroomsModule {}
