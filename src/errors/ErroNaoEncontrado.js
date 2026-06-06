import ErroBase from "./ErroBase.js";

class ErroNaoEncontrado extends ErroBase {

    constructor(mensagem = "Registro nao encontrado.") {
        super(mensagem, 404)
    }

}

export default ErroNaoEncontrado;