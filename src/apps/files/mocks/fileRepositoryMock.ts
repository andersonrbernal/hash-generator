import { Repository } from "typeorm";
import { FileTypeOrm } from "../entities/file.entity";
import { mockDeep } from "jest-mock-extended";

export const fileRepositoryMock = mockDeep<Repository<FileTypeOrm>>();