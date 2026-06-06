class ErroBase extends Error {

    constructor (mensagem = "Erro interno do servidor", status = 500){
        super(); //Chama o construtor de Error do JavaScript
        this.message = mensagem; //Mensagem de erro
        this.status = status; // Codigo HTTP
    }

    enviarResposta(res){ //Metodo que vai mandar a mensagem formatada
        res.status(this.status).send({
            mensagem: this.message,
            status: this.status
        })
    }

}

export default ErroBase;