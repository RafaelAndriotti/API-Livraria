import z from "zod";
import ErroValidacao from "../errors/ErroValidacao.js";

const autoresSchema = z.object({

    autor_nome: z.string(),
    id: z.uuid(),
    nacionalidade_autor: z.string(),
    data_nascimento: z.string(),
    biografia: z.string(),

})

export function validaAutores(req, res, next) {

    const resultado = autoresSchema.safeParse(req.body);

    if(!resultado){

        return next(ErroValidacao(resultado.error.errors[0].message))

    }

    next()
}