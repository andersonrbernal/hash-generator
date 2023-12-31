import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { FilesController } from "./files.controller";
import { fileProviders } from "./files.providers";
import { FilesService } from "./files.service";

@Module({
  imports: [DatabaseModule],
  controllers: [FilesController],
  providers: [...fileProviders, FilesService]
})
export class FilesModule { }
