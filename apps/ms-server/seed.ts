import { EmotionModel } from '@/db/models/emotion.model';
import { FontModel } from '@/db/models/font.model';
import { SentimentModel } from '@/db/models/sentiment.model';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const fonts = [
  {
    code: 1,
    alias: 'Black And White Picture',
    name: 'Black And White Picture',
  },
  { code: 2, alias: 'BMEuljiro10yearslater', name: 'BMEuljiro10yearslater' },
  { code: 3, alias: 'Cafe24Ssukssuk', name: 'Cafe24Ssukssuk' },
  { code: 5, alias: 'CookieRun-Regular', name: 'CookieRun-Regular' },
  { code: 6, alias: 'East Sea Dokdo', name: 'East Sea Dokdo' },
  { code: 7, alias: 'DOSGothic', name: 'DOSGothic' },
  { code: 8, alias: 'DX납량특집', name: 'DX납량특집' },
  { code: 13, alias: 'HanS CalliPunch', name: 'HanS CalliPunch' },
  { code: 15, alias: 'HSGyoulnoonkot', name: 'HSGyoulnoonkot' },
  { code: 16, alias: 'hypmokgak-bold', name: 'hypmokgak-bold' },
  { code: 20, alias: 'Jeju Hallasan', name: 'Jeju Hallasan' },
  { code: 21, alias: 'JSArirangHON-Regular', name: 'JSArirangHON-Regular' },
  { code: 24, alias: 'MapoDacapo', name: 'MapoDacapo' },
  { code: 25, alias: 'MapoHongdaeFreedom', name: 'MapoHongdaeFreedom' },
  { code: 26, alias: 'Jayoo', name: 'Jayoo' },
  { code: 27, alias: 'Nanum Brush Script', name: 'Nanum Brush Script' },
  { code: 29, alias: 'gabia_napjakBlock', name: 'gabia_napjakBlock' },
  { code: 32, alias: 'Rix토이그레이', name: 'Rix토이그레이' },
  { code: 33, alias: 'SANGJUDajungdagam', name: 'SANGJUDajungdagam' },
  { code: 37, alias: 'Single Day', name: 'Single Day' },
  { code: 43, alias: 'WindyLavender', name: 'WindyLavender' },
  { code: 49, alias: 'Jeonju_gakR', name: 'Jeonju_gakR' },
];

const emotions = [
  {
    name: '행복',
    title: 'happy',
  },
  {
    name: '공포',
    title: 'fearful',
  },
  {
    name: '놀람',
    title: 'surprised',
  },
  {
    name: '슬픔',
    title: 'sad',
  },
  {
    name: '분노',
    title: 'angry',
  },
  {
    name: '혐오',
    title: 'disgusted',
  },
  {
    name: '보통',
    title: 'neutral',
  },
];

const sentiments = [
  {
    name: '긍지',
  },
  {
    name: '재미',
  },
  {
    name: '후련',
  },
  {
    name: '다행',
  },
  {
    name: '사랑',
  },

  {
    name: '허무',
  },
  {
    name: '슬프',
  },
  {
    name: '야속',
  },
  {
    name: '후회',
  },
  {
    name: '속상',
  },

  {
    name: '증오',
  },
  {
    name: '불쾌',
  },
  {
    name: '역겹',
  },
  {
    name: '경멸',
  },
  {
    name: '환멸',
  },

  {
    name: '억울',
  },
  {
    name: '짜증',
  },
  {
    name: '역오',
  },
  {
    name: '부럽',
  },
  {
    name: '증오',
  },

  {
    name: '열망',
  },
  {
    name: '황당',
  },
  {
    name: '부럽',
  },
  {
    name: '놀라',
  },
  {
    name: '설레',
  },

  {
    name: '섬뜩',
  },
  {
    name: '놀라',
  },
  {
    name: '무섭',
  },
  {
    name: '두렵',
  },
  {
    name: '겁나',
  },
];

const main = async () => {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
  });
  const db = drizzle(pool, {
    logger: process.env.NODE_ENV !== 'production',
  });

  await db.insert(FontModel).values(fonts);
  await db.insert(EmotionModel).values(emotions);
  await db.insert(SentimentModel).values(sentiments);
};

main();
