import ErroNaoEncontrado from "../errors/ErroNaoEncontrado.js";
import ErroValidacao from "../errors/ErroValidacao.js";
import ErroConflito from "../errors/ErroConflito.js";

const errosSupabase = {

    'PGRST116': new ErroNaoEncontrado(),
    '23505': new ErroConflito('Registro já cadastrado'),
    '23503': new ErroValidacao('ID de autor ou editora não existe'),
    '23502': new ErroValidacao('Campo obrigatório não informado'),

}

export default errosSupabase;