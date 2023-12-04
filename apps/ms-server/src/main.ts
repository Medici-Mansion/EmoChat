import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotnet from 'dotenv';
dotnet.config();

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  const origin = process.env.CLIENT_URL.split(',');
  app.enableCors({
    origin,
    credentials: true,
  });
  await app.listen(PORT);
}
bootstrap();
