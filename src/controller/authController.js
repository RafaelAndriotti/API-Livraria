import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import ErroAutenticacao from '../errors/ErroAutenticacao.js';

// Número de rounds do bcrypt: quanto maior, mais lento e mais seguro.
const SALT_ROUNDS = 10;

function gerarToken(usuario) {
    return jwt.sign(
        { sub: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    )
}

class AuthController {

    static async registrar (req, res, next) {
        try {
            const { nome, email, senha } = req.body

            // Nunca armazenamos a senha em texto puro: guardamos apenas o hash.
            const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS)

            const usuario = await prisma.usuario.create({
                data: { nome, email, senha: senhaHash }
            })

            // Retorna o usuário sem o campo senha.
            res.status(201).json({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                token: gerarToken(usuario)
            })
        } catch (erro) {
            next(erro)
        }
    }

    static async login (req, res, next) {
        try {
            const { email, senha } = req.body

            const usuario = await prisma.usuario.findUnique({ where: { email } })

            // Mensagem genérica de propósito: não revela se o email existe.
            if (!usuario) return next(new ErroAutenticacao("Email ou senha invalidos"))

            const senhaValida = await bcrypt.compare(senha, usuario.senha)
            if (!senhaValida) return next(new ErroAutenticacao("Email ou senha invalidos"))

            res.json({ token: gerarToken(usuario) })
        } catch (erro) {
            next(erro)
        }
    }
}

export default AuthController;
