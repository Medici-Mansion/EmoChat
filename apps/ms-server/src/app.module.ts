import { Module } from '@nestjs/common';

import { DbModule } from './db/db.module';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DbModule, ChatModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
