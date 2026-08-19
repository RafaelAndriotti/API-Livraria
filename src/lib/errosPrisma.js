import ErroNaoEncontrado from "../errors/ErroNaoEncontrado.js";
import ErroValidacao from "../errors/ErroValidacao.js";
import ErroConflito from "../errors/ErroConflito.js";

// Mapeia códigos de erro conhecidos do Prisma para os erros da aplicação.
// Referência: https://www.prisma.io/docs/orm/reference/error-reference
const errosPrisma = {
    // Violação de restrição única (ex.: isbn ou email já cadastrado)
    'P2002': new ErroConflito('Registro já cadastrado (valor único duplicado)'),
    // Violação de chave estrangeira (autor_id/editora_id inexistente)
    'P2003': new ErroValidacao('ID de autor ou editora não existe'),
    // Registro não encontrado em update/delete
    'P2025': new ErroNaoEncontrado(),
}

export default errosPrisma;
