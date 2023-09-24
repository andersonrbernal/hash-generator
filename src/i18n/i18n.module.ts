import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AcceptLanguageResolver, HeaderResolver, I18nModule as NestI18nModule, QueryResolver } from "nestjs-i18n";
import { I18N } from "../config/constants";

@Module({
    imports: [NestI18nModule.forRootAsync({
        useFactory: (configService: ConfigService) => ({
            fallbackLanguage: configService.getOrThrow('FALLBACK_LANGUAGE'),
            loaderOptions: { path: I18N.DIR_PATH, watch: true },
        }),
        resolvers: [
            { use: QueryResolver, options: ['lang'] },
            AcceptLanguageResolver,
            new HeaderResolver(['x-lang'])
        ],
        inject: [ConfigService],
    })]
})
export class I18nModule { }
console.log(I18N)