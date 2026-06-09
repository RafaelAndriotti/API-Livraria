import { supabase } from '../lib/supabase.js';

class LivroController {

    static async listarLivros (req, res, next) {
        
        const { data, error } = await supabase
            .from('livros') //Nome da tabela no supabase
            .select('*')
        
        if (error) return next(error)
        res.json(data)
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