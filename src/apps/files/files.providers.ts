import { DataSource } from 'typeorm';
import { FileTypeOrm } from './entities/file.entity';
import { Provider } from '@nestjs/common';
import { REPOSITORIES } from '../../config/constants';

export const fileProviders: Provider[] = [
  {
    provide: REPOSITORIES.FILE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(FileTypeOrm),
    inject: [REPOSITORIES.DATA_SOURCE],
  },
];