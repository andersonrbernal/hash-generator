import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { APP_BASE } from './config/constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(APP_BASE.PUBLIC_DIR);
  app.setBaseViewsDir(APP_BASE.VIEWS_DIR);
  app.setViewEngine(APP_BASE.VIEW_ENGINE);
  await app.listen(3000);
}
bootstrap();
