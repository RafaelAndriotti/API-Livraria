import { supabase } from '../lib/supabase.js';

class LivroController {

    static async listarLivros (req, res, next) {

        //Impedindo valores absurdos de paginas
        const pagina = Math.max(1, parseInt(req.query.pagina) || 1)
        const limite = Math.min(10, parseInt(req.query.limite) || 10)

        //Calculando o range (ate quantos registros vao aparecer no site)
        const from = (pagina - 1) * limite
        const to = from + limite - 1
        
        const { titulo, genero, ano_publicacao } = req.query
        
        // Substituiu a parte do codigo onde buscava tudo antes sem filtro
        let query = supabase 
            .from('livros')
            .select('*', { count: 'exact' }) //Diz para o supabase retornar o total de registros juntos

        //só aplica o filtro se o parâmetro veio, Se não veio, a linha é ignorada e a query continua sem aquele filtro
        if (titulo) query = query.ilike('titulo', `%${titulo}%`)
        if (genero) query = query.eq('genero', `${genero}`)
        if (ano_publicacao) query = query.eq('ano_publicacao', `${ano_publicacao}`)  
            
        query = query.range(from, to).order('titulo', { ascending: true })

        const { data, error, count } = await query

        if (error) return next(error)
        res.json({
            dados: data,
            paginacao: {
                total: count,
                pagina,
                limite,
                total_pagina: Math.ceil(count/limite)
            }
        }) 
    
        //retirado do codigo para implementar o filtro
        // const { data, error } = await supabase
        //     .from('livros') //Nome da tabela no supabase
        //     .select('*')
        
        
    }

    static async cadastrarLivro (req, res, next) {

             const { titulo, autor_id, editora_id, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse  } = req.body
            
                // eslint-disable-next-line no-unused-vars
                const { data, error } = await supabase
                    .from('livros')
                    .insert({ titulo, autor_id, editora_id, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse })
                    .select()
                    .single()
                
            if(error)return next(error)
                 
            res.status(201).json({ message: `O livro ${ titulo } foi criado com sucesso` })

    }

    static async listaLivroPorId (req, res, next) {

            const { data, error } = await supabase
                    .from('livros')
                    .select('*')
                    .eq('id', req.params.id)
                    .single()

            if(error)return next(error)

            res.json(data)
        
    }

    static async atualizaLivro (req, res, next){

            const { titulo, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse } = req.body

            const { data,error } = await supabase
                .from('livros')
                .update({ titulo, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse })
                .eq('id', req.params.id)
                .select()
                .single()

            if(error)return next(error)
    
            res.json(`Informacoes do livro ${data.titulo} atualizadas com sucesso`)

    }

    static async deletarLivro( req, res, next){

            const { error } = await supabase
                .from('livros')
                .delete()
                .eq('id', req.params.id)

            if(error)return next(error)
    
            res.status(200).send("Livro deletado com sucesso")

    }    
}

export default LivroController;