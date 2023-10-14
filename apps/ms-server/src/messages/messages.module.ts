import { DbModule } from '@/db/db.module';
import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Module({
  imports: [DbModule],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
