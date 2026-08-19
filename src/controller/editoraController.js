import prisma from '../lib/prisma.js';
import ErroNaoEncontrado from '../errors/ErroNaoEncontrado.js';

class EditoraController {

    static async listarEditoras (req, res, next) {
        try {
            const pagina = Math.max(1, parseInt(req.query.pagina) || 1)
            const limite = Math.min(10, parseInt(req.query.limite) || 10)
            const skip = (pagina - 1) * limite

            const { nome_editora, pais_editora } = req.query

            const where = {}
            if (nome_editora) where.nome_editora = { contains: nome_editora, mode: 'insensitive' }
            if (pais_editora) where.pais_editora = { contains: pais_editora, mode: 'insensitive' }

            const [dados, total] = await prisma.$transaction([
                prisma.editora.findMany({
                    where,
                    skip,
                    take: limite,
                    orderBy: { nome_editora: 'asc' }
                }),
                prisma.editora.count({ where })
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

    static async cadastrarEditora (req, res, next) {
        try {
            const { nome_editora, pais_editora, site_editora, email_contato } = req.body

            await prisma.editora.create({
                data: { nome_editora, pais_editora, site_editora, email_contato }
            })

            res.status(201).send(`A editora ${nome_editora} foi criada com sucesso.`)
        } catch (erro) {
            next(erro)
        }
    }

    static async listarEditoraPorId (req, res, next) {
        try {
            const editora = await prisma.editora.findUnique({ where: { id: req.params.id } })

            if (!editora) return next(new ErroNaoEncontrado())

            res.json(editora)
        } catch (erro) {
            next(erro)
        }
    }

    static async atualizarEditora (req, res, next) {
        try {
            const { nome_editora, pais_editora, site_editora, email_contato } = req.body

            const editora = await prisma.editora.update({
                where: { id: req.params.id },
                data: { nome_editora, pais_editora, site_editora, email_contato }
            })

            res.status(200).send(`Editora atualizada com sucesso ${editora.nome_editora}.`)
        } catch (erro) {
            next(erro)
        }
    }

    static async deletarEditora (req, res, next) {
        try {
            await prisma.editora.delete({ where: { id: req.params.id } })

            res.status(200).send("Editora deletada com sucesso.")
        } catch (erro) {
            next(erro)
        }
    }
}

export default EditoraController;
