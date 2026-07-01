import { supabase } from '../lib/supabase.js';

class AutoresController {

    static async listarAutores (req, res, next) {

        //Valores da paginacao
        const pagina = Math.max(1, parseInt(req.query.pagina) || 1)
        const limite = Math.min(10, parseInt(req.query.limite) || 10)

        //calculando o range (qtd de registros por pagina)
        const from = (pagina - 1) * limite
        const to = from + limite - 1
            
        const { autor_nome, nacionalidade_autor } = req.query

        let query = supabase
            .from('autores')
            .select('*', { count: 'exact' })//Informa ao banco para retornar o total de registros juntos

        //Vai aplicar o filtro se o parametro vier de acordo com as validacoes abaixo, sem isso ele sera ignorado e vai retornar todos os registros da tabela

        if(autor_nome) query = query.ilike('autor_nome', `%${autor_nome}`)
        if(nacionalidade_autor) query = query.ilike('nacionalidade_autor', `%${nacionalidade_autor}%`)
            
        query = query.range(from, to).order('autor_nome', { ascending: true })
        
        const {data, error, count} = await query
        
            if(error) return next(error)

            res.json({
                dados: data,
                paginacao: {
                    total: count,
                    pagina,
                    limite,
                    total_pagina: Math.ceil(count/limite)
                }
            })

        // const { data, error } = await supabase
            //     .from('autores')
            //     .select("*")    

    }


    static async cadastrarAutor (req, res, next) {
        
            const { autor_nome, nacionalidade_autor, data_nascimento, biografia } = req.body
            
            // eslint-disable-next-line no-unused-vars
            const { data, error } = await supabase
                .from('autores')
                .insert({ autor_nome, nacionalidade_autor, data_nascimento, biografia })
                .select()
                .single()

            if(error) return next(error)
        
            res.status(201).json({ message: `O autor ${autor_nome} foi cadastrado com sucesso.` })
    
    }

    static async listarAutorPorId (req, res, next) {
            
            const { data, error } = await supabase
                .from('autores')
                .select("*")
                .eq("id", req.params.id)
                .single()

            if(error)return next(error)

            res.json(data)
 
    }

    static async atualizarAutor (req, res, next){

            const { autor_nome, nacionalidade_autor, data_nascimento, biografia } = req.body

            const { data, error } = await supabase
                .from('autores')
                .update ({ autor_nome, nacionalidade_autor,  data_nascimento, biografia})
                .eq('id', req.params.id)
                .select()
                .single()

            if(error)return next(error)

                res.json(`Atualizada as informacoes do autor ${data.autor_nome}.`)

    }

    static async deletarAutor (req, res, next) {

        
            
            const { error } = await supabase
                .from('autores')
                .delete()
                .eq('id', req.params.id)

            if(error)return next(error)

                res.status(200).send("Autor deletado com sucesso")

    }
    

}

export default AutoresController;

