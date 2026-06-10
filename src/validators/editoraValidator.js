import z from "zod";
import ErroValidacao from "../errors/ErroValidacao.js";

const editoraSchema = z.object({

    nome_editora: z.string(),
    pais_editrora: z.string(),
    site_editora: z.string().url(),
    email_contato: z.string().email()   

})

export function validaEditora (req, res, next) {
    
    const resultado = editoraSchema.safeParse(req.body)

    if(resultado.success){

        return next(new ErroValidacao(resultado.error.errors[0].message))

    }

    next()
} 

