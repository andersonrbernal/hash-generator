import { join } from "path";

export const REPOSITORIES = {
    FILE: 'FILE_REPOSITORY',
    DATA_SOURCE: 'DATA_SOURCE',
}

export const APP_BASE = {
    VIEW_ENGINE: 'hbs',
    PUBLIC_DIR: join(__dirname, '..', '..', 'public'),
    VIEWS_DIR: join(__dirname, '..', '..', 'views'),
};