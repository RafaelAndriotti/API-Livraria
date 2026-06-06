import ErroBase from "./ErroBase.js";


class ErroConflito extends ErroBase {
    constructor(mensagem = "Registro ja cadastrado") {
        super(mensagem, 409)
    }
}

export default ErroConflito;