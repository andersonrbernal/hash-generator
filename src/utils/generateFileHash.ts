import { BinaryToTextEncoding, createHash } from "crypto";

/**
 * Gera uma hash a partir de um buffer de dados usando um algoritmo de hash específico
 * e uma codificação de saída específica.
 *
 * @param buffer - O buffer de dados a partir do qual a hash será gerada.
 * @param options - Opções para a geração da hash.
 * @param options.algorithm - O algoritmo de hash a ser utilizado (por exemplo, 'md5', 'sha256').
 * @param options.encoding - A codificação de saída da hash (por exemplo, 'hex', 'base64').
 *
 * @returns A hash gerada como uma string na codificação especificada.
 */
export const generateFileHash = (
    buffer: Buffer,
    options: { algorithm: string, encoding: BinaryToTextEncoding }
): string => {
    return createHash(options.algorithm)
        .update(buffer)
        .digest(options.encoding);
};
