import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
// import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import { MainModule } from './main.module';
import { MyLogger } from 'utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, {
    logger: new MyLogger(),
  });
  app.enableCors();
  app.use(helmet());
  // app.use(csurf());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  // app.setGlobalPrefix('v1');
  await app.listen(3000);
}

bootstrap();
