import z from "zod";
import ErroValidacao from "../errors/ErroValidacao.js";

const registroSchema = z.object({
    nome: z.string().min(1),
    email: z.string().email(),
    senha: z.string().min(6)
})

const loginSchema = z.object({
    email: z.string().email(),
    senha: z.string().min(1)
})

function validar(schema, req, next) {
    const resultado = schema.safeParse(req.body)

    if (!resultado.success) {
        return next(new ErroValidacao(resultado.error.issues[0].message))
    }

    next()
}

export function validaRegistro(req, res, next) {
    validar(registroSchema, req, next)
}

export function validaLogin(req, res, next) {
    validar(loginSchema, req, next)
}
