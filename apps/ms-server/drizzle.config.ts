import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({
  path: '.env',
});

export default {
  schema: './src/db/models/*',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    // connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
