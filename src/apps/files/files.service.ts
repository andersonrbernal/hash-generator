import { Inject, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { Repository } from 'typeorm';
import { FileTypeOrm } from './entities/file.entity';
import { REPOSITORIES } from '../../config/constants';

/**
 * Serviço para gerenciar operações relacionadas a arquivos.
 */
@Injectable()
export class FilesService {
  /**
   * Construtor da classe `FilesService`.
   * @param fileRepository - O repositório para interagir com o banco de dados de arquivos.
   */
  constructor(
    @Inject(REPOSITORIES.FILE)
    private fileRepository: Repository<FileTypeOrm>,
  ) { }

  /**
   * Cria um novo registro de arquivo com base nos dados fornecidos.
   * @param createFileDto - Dados para criar o arquivo.
   * @returns Uma promessa que resolve para o arquivo criado.
   */
  async create(createFileDto: CreateFileDto): Promise<FileTypeOrm> {
    return this.fileRepository.create(createFileDto);
  }

  /**
   * Salva um registro de arquivo existente no banco de dados.
   * @param file - O arquivo a ser salvo.
   * @returns Uma promessa que resolve para o arquivo salvo.
   */
  async save(file: FileTypeOrm): Promise<FileTypeOrm> {
    return this.fileRepository.save(file);
  }

  /**
   * Recupera todos os registros de arquivo no banco de dados.
   * @returns Uma promessa que resolve para uma matriz de objetos de arquivo.
   */
  async findAll(): Promise<FileTypeOrm[]> {
    return this.fileRepository.find();
  }

  /**
   * Recupera um único registro de arquivo com base no ID fornecido.
   * @param id - O ID do arquivo a ser recuperado.
   * @returns Uma promessa que resolve para o arquivo recuperado.
   */
  async findOne(id: string): Promise<FileTypeOrm> {
    return this.fileRepository.findOneByOrFail({ id });
  }

  /**
   * Encontra um registro de arquivo com base no hash fornecido.
   * @param hash - O hash do arquivo a ser encontrado.
   * @returns Uma promessa que resolve para o arquivo encontrado ou `null` se não encontrado.
   */
  async findByHash(hash: string): Promise<FileTypeOrm | null> {
    return this.fileRepository.findOneBy({ hash: hash });
  }

  /**
   * Atualiza um registro de arquivo existente com base no ID fornecido e nos dados de atualização.
   * @param id - O ID do arquivo a ser atualizado.
   * @param updateFileDto - Dados de atualização do arquivo.
   * @returns Uma promessa que resolve para o arquivo atualizado.
   */
  async update(id: string, updateFileDto: UpdateFileDto): Promise<FileTypeOrm> {
    await this.fileRepository.update(id, updateFileDto);
    return this.fileRepository.findOneByOrFail({ id });
  }

  /**
   * Remove um registro de arquivo com base no ID fornecido.
   * @param id - O ID do arquivo a ser removido.
   * @returns Uma promessa que resolve para um valor booleano indicando o sucesso da remoção.
   */
  async remove(id: string): Promise<boolean> {
    const deletedFile = await this.fileRepository.delete(id);
    return deletedFile.affected > 0;
  }
}
