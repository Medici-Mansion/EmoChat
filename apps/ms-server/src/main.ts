import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  const origin = process.env.CLIENT_URL.split(',');

  app.enableCors({
    origin,
    credentials: true,
  });
  await app.listen(4000);
}
bootstrap();
