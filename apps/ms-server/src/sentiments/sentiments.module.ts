import { Module } from '@nestjs/common';
import { SentimentsService } from './sentiments.service';
import { DbModule } from '@/db/db.module';

@Module({
  imports: [DbModule],
  providers: [SentimentsService],
  exports: [SentimentsService],
})
export class SentimentsModule {}
