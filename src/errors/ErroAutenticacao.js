import ErroBase from "./ErroBase.js";

class ErroAutenticacao extends ErroBase {

    constructor(mensagem = "Falha na autenticacao") {
        super(mensagem, 401)
    }

}

export default ErroAutenticacao;
