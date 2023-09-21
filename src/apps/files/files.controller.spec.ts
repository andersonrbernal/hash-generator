import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import { fileMock } from './mocks/fileMock';
import { fileProvider } from './mocks/fileProvider';
import { faker } from '@faker-js/faker';
import { createHash } from 'crypto';
import { Readable } from 'stream';
import { ForbiddenException } from '@nestjs/common';
import { generateFileHash } from '../../utils/generateFileHash';

describe('FilesController', () => {
    let controller: FilesController;
    let service: FilesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FilesController],
            providers: [FilesService, fileProvider],
        }).compile();

        controller = module.get<FilesController>(FilesController);
        service = module.get<FilesService>(FilesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    })

    describe('create', () => {
        const multerFileMock: Express.Multer.File = {
            buffer: fileMock.buffer,
            mimetype: fileMock.mime_type,
            destination: faker.system.directoryPath(),
            path: faker.system.filePath(),
            fieldname: File.name.toLowerCase(),
            originalname: faker.system.commonFileName(),
            filename: faker.system.fileName(),
            size: faker.number.int(),
            stream: new Readable(),
            encoding: faker.string.alpha()
        };

        it('should create a new file', async () => {
            const createFileDto: CreateFileDto = { ...fileMock };

            const createdFile: File = { ...fileMock, ...createFileDto };
            const expectedHash = generateFileHash(createFileDto.buffer, { algorithm: 'md5', encoding: 'base64' });

            jest.spyOn(service, 'findByHash').mockResolvedValueOnce(null);
            jest.spyOn(service, 'create').mockResolvedValueOnce(createdFile);
            jest.spyOn(service, 'save').mockResolvedValueOnce(createdFile);

            const result = await controller.create({ isMalicious: undefined }, multerFileMock);

            expect(result).toEqual({ ...fileMock, hash: expectedHash });
        });

        it('should not create a file with the same hash', async () => {
            const existingFile = { ...fileMock };

            jest.spyOn(service, 'findByHash').mockResolvedValueOnce(existingFile);

            try {
                await controller.create({ isMalicious: undefined }, multerFileMock);
            } catch (error) {
                expect(error).toBeInstanceOf(ForbiddenException);
                expect(error.message).toBe('Arquivo malicioso.');
            }
        });

        it('should not create a malicious file', async () => {
            jest.spyOn(service, 'create').mockResolvedValueOnce(fileMock);

            try {
                await controller.create({ isMalicious: 'on' }, multerFileMock);
            } catch (error) {
                expect(error).toBeInstanceOf(ForbiddenException);
                expect(error.message).toBe('Arquivo malicioso.');
            }
        });
    });

    describe('findAll', () => {
        it('should return an array of files', async () => {
            const filesList: File[] = [fileMock];

            jest.spyOn(service, 'findAll').mockResolvedValue(filesList);

            const result = await controller.findAll();

            expect(result).toEqual(filesList);
        });
    });

    describe('findOne', () => {
        it('should return a file by ID', async () => {
            const fileId = fileMock.id;

            jest.spyOn(service, 'findOne').mockResolvedValue(fileMock);

            const result = await controller.findOne(fileId);

            expect(result).toEqual(fileMock);
        });
    });

    describe('update', () => {
        it('should update a file by ID', async () => {
            const fileId = fileMock.id;
            const updateFileDto: UpdateFileDto = {
                buffer: Buffer.from(faker.string.binary(), 'base64'),
                mime_type: faker.system.mimeType(),
            };

            const updatedFile: File = { ...fileMock, ...updateFileDto };

            jest.spyOn(service, 'update').mockResolvedValue(updatedFile);

            const result = await controller.update(fileId, updateFileDto);

            expect(result).toEqual(updatedFile);
        });
    });

    describe('remove', () => {
        it('should remove a file by ID', async () => {
            const fileId = fileMock.id;
            jest.spyOn(service, 'remove').mockResolvedValue(true);

            const result = await controller.remove(fileId);

            expect(result).toBe(true);
        });
    });
});
