import { DB_MODULE } from '@/common/common.constants';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { schema } from './models';

@Module({
  providers: [
    {
      provide: DB_MODULE,
      useFactory: async (): Promise<unknown> => {
        const pool = new Pool({
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          user: process.env.DB_USER,
          password: process.env.DB_PWD,
          database: process.env.DB_NAME,
        });
        const db = drizzle(pool, {
          schema: schema,
          logger: process.env.NODE_ENV !== 'production',
        });
        return db;
      },
    },
  ],
  exports: [DB_MODULE],
})
export class DbModule {}
