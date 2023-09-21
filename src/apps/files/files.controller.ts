import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, ForbiddenException } from '@nestjs/common';
import { FilesService } from './files.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { createHash } from 'crypto';
import { FileInterceptor } from '@nestjs/platform-express';
import { generateFileHash } from '../../utils/generateFileHash';

/**
 * Controlador para gerenciar operações HTTP relacionadas a arquivos.
 */
@Controller('files')
export class FilesController {
  /**
   * Construtor do `FilesController`.
   * @param filesService - O serviço que gerencia operações relacionadas a arquivos.
   */
  constructor(private readonly filesService: FilesService) { }

  /**
   * Rota HTTP POST para criar um novo arquivo.
   * @param createFileDto - Dados para criar o arquivo.
   * @returns O arquivo criado.
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() body: { isMalicious: 'on' },
    @UploadedFile() file: Express.Multer.File
  ) {
    const hash = generateFileHash(file.buffer, {
      algorithm: 'md5',
      encoding: 'base64'
    });

    const existingFile = await this.filesService.findByHash(hash);

    if (existingFile) throw new ForbiddenException({ statusCode: 403, message: "Arquivo malicioso." });

    if (body.isMalicious === 'on') {
      const createMaliciousFile = await this.filesService.create({
        buffer: file.buffer,
        mime_type: file.mimetype
      });

      await this.filesService.save(createMaliciousFile);
      throw new ForbiddenException({ statusCode: 403, message: "Arquivo malicioso." });
    }

    const createFile = await this.filesService.create({
      buffer: file.buffer,
      mime_type: file.mimetype
    });
    createFile.hash = hash;
    return this.filesService.save(createFile);
  }

  /**
   * Rota HTTP GET para buscar todos os arquivos.
   * @returns Uma lista de arquivos.
   */
  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  /**
   * Rota HTTP GET para buscar um arquivo pelo seu ID.
   * @param id - O ID do arquivo a ser buscado.
   * @returns O arquivo encontrado.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  /**
   * Rota HTTP PUT para atualizar um arquivo pelo seu ID.
   * @param id - O ID do arquivo a ser atualizado.
   * @param updateFileDto - Dados de atualização do arquivo.
   * @returns O arquivo atualizado.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(id, updateFileDto);
  }

  /**
   * Rota HTTP DELETE para remover um arquivo pelo seu ID.
   * @param id - O ID do arquivo a ser removido.
   * @returns Um valor booleano indicando o sucesso da remoção.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(id);
  }
}
