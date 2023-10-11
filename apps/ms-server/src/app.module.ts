import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';

import { DbModule } from './db/db.module';

@Module({
  imports: [DbModule],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
