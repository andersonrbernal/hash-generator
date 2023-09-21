import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { FilesService } from './files.service';
import { FileTypeOrm } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { fileProvider } from './mocks/fileProvider';
import { fileMock } from './mocks/fileMock';
import { faker } from '@faker-js/faker';
import { REPOSITORIES } from '../../config/constants';

describe('FilesService', () => {
    let service: FilesService;
    let repository: Repository<FileTypeOrm>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FilesService, fileProvider],
        }).compile();

        service = module.get<FilesService>(FilesService);
        repository = module.get<Repository<FileTypeOrm>>(REPOSITORIES.FILE);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    })

    describe('create', () => {
        it('should create a new file', async () => {
            const createFileDto: CreateFileDto = {
                buffer: Buffer.from(faker.string.binary(), 'base64'),
                mime_type: faker.system.mimeType(),
            };

            const newFile: FileTypeOrm = { ...fileMock, ...createFileDto, };

            jest.spyOn(repository, 'create').mockReturnValue(newFile);
            jest.spyOn(repository, 'save').mockResolvedValue(newFile);

            const result = await service.create(createFileDto);

            expect(result).toEqual(newFile);
        });
    });

    describe('save', () => {
        it('should save an existing file', async () => {
            const existingFile: FileTypeOrm = { ...fileMock };

            jest.spyOn(repository, 'save').mockResolvedValue(existingFile);

            const result = await service.save(existingFile);

            expect(result).toEqual(existingFile);
        });
    });

    describe('findAll', () => {
        it('should return an array of files', async () => {
            const filesList: FileTypeOrm[] = [
            ];

            jest.spyOn(repository, 'find').mockResolvedValue(filesList);

            const result = await service.findAll();

            expect(result).toEqual(filesList);
        });
    });

    describe('findOne', () => {
        it('should return a file by ID', async () => {
            const fileId = fileMock.id;
            const file: FileTypeOrm = { ...fileMock };

            jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(file);

            const result = await service.findOne(fileId);

            expect(result).toEqual(file);
        });
    });

    describe('findByHash', () => {
        it('should return a file by hash', async () => {
            const fileId = fileMock.id;
            const file: FileTypeOrm = { ...fileMock };

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(file);

            const result = await service.findOne(fileId);

            expect(result).toEqual(file);
        });
    });

    describe('update', () => {
        it('should update a file by ID', async () => {
            const fileId = fileMock.id;
            const updateFileDto: UpdateFileDto = {
                buffer: Buffer.from(faker.string.binary(), 'base64'),
                mime_type: faker.system.mimeType(),
            };

            const updatedFile: FileTypeOrm = { ...fileMock, ...updateFileDto };

            jest.spyOn(repository, 'update').mockResolvedValue({} as any);
            jest.spyOn(repository, 'findOneByOrFail').mockResolvedValue(updatedFile);

            const result = await service.update(fileId, updateFileDto);

            expect(result).toEqual(updatedFile);
        });
    });

    describe('remove', () => {
        it('should remove a file by ID', async () => {
            const fileId = faker.string.uuid();
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1, raw: undefined });

            const result = await service.remove(fileId);

            expect(result).toBe(true);
        });

        it('should return false if no file is removed', async () => {
            const fileId = faker.string.uuid();
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: undefined });

            const result = await service.remove(fileId);

            expect(result).toBe(false);
        });
    });
});
