import ErroBase from "../errors/ErroBase.js";
import errosPrisma from "../lib/errosPrisma.js";

// eslint-disable-next-line no-unused-vars
function manipuladorDeErros(erro, req, res, next) {

    // Verifica se é um erro conhecido do Prisma (possui `code` do tipo Pxxxx)
    if (erro.code && errosPrisma[erro.code]) {
        return errosPrisma[erro.code].enviarResposta(res)
    }

    // Verifica se é um erro da aplicação
    if (erro instanceof ErroBase) {
        return erro.enviarResposta(res)
    }

    // Erro geral do sistema
    console.error(erro)
    res.status(500).json({ mensagem: 'Erro interno do servidor', status: 500 });
}

export default manipuladorDeErros;
