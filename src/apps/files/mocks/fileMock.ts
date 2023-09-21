import { faker } from "@faker-js/faker";
import { createHash } from "crypto";
import { File } from "../entities/file.entity";

const buffer = Buffer.from(faker.string.binary(), 'base64');

export const fileMock: File = {
    id: faker.string.uuid(),
    buffer: buffer,
    hash: createHash('md5').update(buffer).digest('base64'),
    mime_type: faker.system.mimeType(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.future(),
};