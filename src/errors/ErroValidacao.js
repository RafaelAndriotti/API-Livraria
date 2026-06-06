import ErroBase from "./ErroBase.js";


class ErroValidacao extends ErroBase{

    constructor (mensagem = "Erro de validacao do sistema"){
        super(mensagem, 400)
    }

}

export default ErroValidacao