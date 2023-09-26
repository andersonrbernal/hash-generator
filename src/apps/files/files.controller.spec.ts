import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';
import { fileMock } from './mocks/fileMock';
import { fileProvider } from './mocks/fileProvider';
import { faker } from '@faker-js/faker';
import { Readable } from 'stream';
import { ForbiddenException, Provider } from '@nestjs/common';
import { generateFileHash } from '../../utils/generateFileHash';
import { mockDeep } from 'jest-mock-extended';
import { I18nService } from 'nestjs-i18n';

const i18nServiceMock: Provider = {
    provide: I18nService,
    useValue: mockDeep<I18nService>()
};

describe('FilesController', () => {
    let controller: FilesController;
    let service: FilesService;
    let i18nService: I18nService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FilesController],
            providers: [FilesService, fileProvider, i18nServiceMock],
        }).compile();

        controller = module.get<FilesController>(FilesController);
        service = module.get<FilesService>(FilesService);
        i18nService = module.get<I18nService>(I18nService);
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

            await expect(controller.create({}, multerFileMock))
                .rejects
                .toThrowError(new ForbiddenException({ statusCode: 403, message: "Forbidden Exception" }))
        });

        it('should not create a malicious file', async () => {
            jest.spyOn(service, 'create').mockResolvedValueOnce(fileMock);

            await expect(controller.create({ isMalicious: 'on' }, multerFileMock))
                .rejects
                .toThrowError(new ForbiddenException({ statusCode: 403, message: "Forbidden Exception" }))
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
