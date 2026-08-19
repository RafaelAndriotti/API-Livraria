import prisma from '../lib/prisma.js';
import ErroNaoEncontrado from '../errors/ErroNaoEncontrado.js';

class AutoresController {

    static async listarAutores (req, res, next) {
        try {
            const pagina = Math.max(1, parseInt(req.query.pagina) || 1)
            const limite = Math.min(10, parseInt(req.query.limite) || 10)
            const skip = (pagina - 1) * limite

            const { autor_nome, nacionalidade_autor } = req.query

            const where = {}
            if (autor_nome) where.autor_nome = { contains: autor_nome, mode: 'insensitive' }
            if (nacionalidade_autor) where.nacionalidade_autor = { contains: nacionalidade_autor, mode: 'insensitive' }

            const [dados, total] = await prisma.$transaction([
                prisma.autor.findMany({
                    where,
                    skip,
                    take: limite,
                    orderBy: { autor_nome: 'asc' }
                }),
                prisma.autor.count({ where })
            ])

            res.json({
                dados,
                paginacao: {
                    total,
                    pagina,
                    limite,
                    total_pagina: Math.ceil(total / limite)
                }
            })
        } catch (erro) {
            next(erro)
        }
    }

    static async cadastrarAutor (req, res, next) {
        try {
            const { autor_nome, nacionalidade_autor, data_nascimento, biografia } = req.body

            await prisma.autor.create({
                data: { autor_nome, nacionalidade_autor, data_nascimento, biografia }
            })

            res.status(201).json({ message: `O autor ${autor_nome} foi cadastrado com sucesso.` })
        } catch (erro) {
            next(erro)
        }
    }

    static async listarAutorPorId (req, res, next) {
        try {
            const autor = await prisma.autor.findUnique({ where: { id: req.params.id } })

            if (!autor) return next(new ErroNaoEncontrado())

            res.json(autor)
        } catch (erro) {
            next(erro)
        }
    }

    static async atualizarAutor (req, res, next) {
        try {
            const { autor_nome, nacionalidade_autor, data_nascimento, biografia } = req.body

            const autor = await prisma.autor.update({
                where: { id: req.params.id },
                data: { autor_nome, nacionalidade_autor, data_nascimento, biografia }
            })

            res.json(`Atualizada as informacoes do autor ${autor.autor_nome}.`)
        } catch (erro) {
            next(erro)
        }
    }

    static async deletarAutor (req, res, next) {
        try {
            await prisma.autor.delete({ where: { id: req.params.id } })

            res.status(200).send("Autor deletado com sucesso")
        } catch (erro) {
            next(erro)
        }
    }
}

export default AutoresController;
