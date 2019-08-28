import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  // app.setGlobalPrefix('v1');
  await app.listen(3000);
}

bootstrap();
