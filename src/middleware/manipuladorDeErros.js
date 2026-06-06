import ErroBase from "../errors/ErroBase.js";
import errosSupabase from "../lib/errosSupabase.js";

// eslint-disable-next-line no-unused-vars
function manipuladorDeErros(erro, req, res, next) {

    //Verifica se eh um erro conhecido do supabase
    if (erro.code && errosSupabase[erro.code]){
        return errosSupabase[erro.code].enviarResposta(res)
    }   

    //Verifica se eh um erro da aplicacao
    if (erro instanceof ErroBase){
        return erro.enviarResposta(res)
    }

    //Erro geral do sistema
    res.status(500).json({ mensagem: 'Erro interno do servidor', status: 500 });
}

export default manipuladorDeErros;