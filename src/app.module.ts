import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { FilesModule } from './apps/files/files.module';
import { I18nModule } from './i18n/i18n.module';

@Module({
  imports: [DatabaseModule, FilesModule, ConfigModule.forRoot({ isGlobal: true }), I18nModule],
  controllers: [AppController],
  providers: [ConfigService],
  exports: [DatabaseModule]
})
export class AppModule { }
