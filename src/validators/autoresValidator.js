import z from "zod";
import ErroValidacao from "../errors/ErroValidacao.js";

const autoresSchema = z.object({

    autor_nome: z.string(),
    nacionalidade_autor: z.string(),
    data_nascimento: z.string(),
    biografia: z.string(),

})

export function validaAutores(req, res, next) {
    
    const resultado = autoresSchema.safeParse(req.body);

    if(!resultado.success){

        return next(new ErroValidacao(resultado.error.errors[0].message))

    }

    next()
}