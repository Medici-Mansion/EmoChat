import { DRIZZLE_MODULE } from '@/common/common.constants';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { schema } from './models';

@Module({
  providers: [
    {
      provide: DRIZZLE_MODULE,
      useFactory: async (): Promise<unknown> => {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const db = drizzle(pool, {
          schema: schema,
          logger: process.env.NODE_ENV === 'development',
        });

        return db;
      },
    },
  ],
})
export class DbModule {}
