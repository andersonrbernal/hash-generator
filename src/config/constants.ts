import { readdir } from "fs/promises";
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

export const I18N = {
    DIR_PATH: join(__dirname, "..", "i18n"),
    LOCALES: async (i18nDirectory: string): Promise<string[]> => {
        let locales: string[] = [];
        const dir = await readdir(i18nDirectory, { withFileTypes: true });

        dir.forEach(dirent => dirent.isDirectory() ? locales.push(dirent.name) : null);

        return locales;
    }
}