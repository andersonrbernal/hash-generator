import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { FilesModule } from './apps/files/files.module';

@Module({
  imports: [DatabaseModule, FilesModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [ConfigService],
  exports: [DatabaseModule]
})
export class AppModule { }
