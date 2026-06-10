import z from "zod"
import ErroValidacao from "../errors/ErroValidacao.js"

const livroSchema = z.object({

    id: z.uuid(),
    titulo: z.string(),
    autor_id: z.uuid(),
    editora_id: z.uuid(),
    isbn: z.string(),
    preco: z.number(),
    paginas: z.int(),
    ano_publicacao: z.int(),
    genero: z.string(),
    estoque: z.int(),
    sinopse: z.string()

})

export function validaLivro(req, res, next) {

    const resultado = livroSchema.safeParse(req.body)

    if(!resultado) {

        return next(ErroValidacao(resultado.error.erro[0].message))

    }

    next()
}