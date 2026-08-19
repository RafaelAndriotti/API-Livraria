import prisma from '../lib/prisma.js';
import ErroNaoEncontrado from '../errors/ErroNaoEncontrado.js';

class LivroController {

    static async listarLivros (req, res, next) {
        try {
            // Impede valores absurdos de paginação
            const pagina = Math.max(1, parseInt(req.query.pagina) || 1)
            const limite = Math.min(10, parseInt(req.query.limite) || 10)
            const skip = (pagina - 1) * limite

            const { titulo, genero, ano_publicacao } = req.query

            // Monta os filtros dinamicamente: só entra no where quem foi informado
            const where = {}
            if (titulo) where.titulo = { contains: titulo, mode: 'insensitive' }
            if (genero) where.genero = { equals: genero, mode: 'insensitive' }
            if (ano_publicacao) where.ano_publicacao = parseInt(ano_publicacao)

            const [dados, total] = await prisma.$transaction([
                prisma.livro.findMany({
                    where,
                    skip,
                    take: limite,
                    orderBy: { titulo: 'asc' }
                }),
                prisma.livro.count({ where })
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

    static async cadastrarLivro (req, res, next) {
        try {
            const { titulo, autor_id, editora_id, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse } = req.body

            await prisma.livro.create({
                data: { titulo, autor_id, editora_id, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse }
            })

            res.status(201).json({ message: `O livro ${titulo} foi criado com sucesso` })
        } catch (erro) {
            next(erro)
        }
    }

    static async listaLivroPorId (req, res, next) {
        try {
            const livro = await prisma.livro.findUnique({ where: { id: req.params.id } })

            if (!livro) return next(new ErroNaoEncontrado())

            res.json(livro)
        } catch (erro) {
            next(erro)
        }
    }

    static async atualizaLivro (req, res, next) {
        try {
            const { titulo, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse } = req.body

            const livro = await prisma.livro.update({
                where: { id: req.params.id },
                data: { titulo, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse }
            })

            res.json(`Informacoes do livro ${livro.titulo} atualizadas com sucesso`)
        } catch (erro) {
            next(erro)
        }
    }

    static async deletarLivro (req, res, next) {
        try {
            await prisma.livro.delete({ where: { id: req.params.id } })

            res.status(200).send("Livro deletado com sucesso")
        } catch (erro) {
            next(erro)
        }
    }
}

export default LivroController;
