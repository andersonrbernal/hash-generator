import { REPOSITORIES } from '../config/constants';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const databaseProviders: Provider[] = [
  {
    provide: REPOSITORIES.DATA_SOURCE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.getOrThrow('DATABASE_HOST'),
        port: configService.getOrThrow('DATABASE_PORT'),
        username: configService.getOrThrow('DATABASE_USERNAME'),
        password: configService.getOrThrow('DATABASE_PASSWORD'),
        database: configService.getOrThrow('DATABASE_DB_NAME'),
        entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: configService.get('NODE_ENV') === 'production' ? false : true,
      });

      return dataSource.initialize();
    },
  },
];
