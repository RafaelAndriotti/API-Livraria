import { supabase } from '../lib/supabase.js';

class LivroController {

    static async listarLivros (req, res, next) {
        
        const { data, error } = await supabase
            .from('livros') //Nome da tabela no supabase
            .select('*')
        
        if (error) return res.status(500).json({ error: error.message })
        res.json(data)
    }

    static async cadastrarLivro (req, res, next) {

        try {

             const { titulo, autor_id, editora_id, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse  } = req.body
            
                const { data, error } = await supabase
                    .from('livros')
                    .insert({ titulo, autor_id, editora_id, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse })
                    .select()
                    .single()
                
                 
            res.status(201).json({ message: `O livro ${ titulo } foi criado com sucesso` })

        } catch (error) {
        
            res.status(500).json({ error: error.message })
        
        }


    }

    static async listaLivroPorId (req, res, next) {

        try {
            const { data, error } = await supabase
                    .from('livros')
                    .select('*')
                    .eq('id', req.params.id)
                    .single()

            res.json(data)
        
        } catch (error) {

           res.status(404).json({ error: 'Livro não encontrado' })
    
        }

    }

    static async atualizaLivro (req, res, next){

        try {

            const { titulo, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse } = req.body

            const { data,error } = await supabase
                .from('livros')
                .update({ titulo, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse })
                .eq('id', req.params.id)
                .select()
                .single()

    
                res.json(`Informacoes do livro ${data.titulo} atualizadas com sucesso`)

        } catch (error) {

            res.status(500).json({ error: error.message })
        
        }

    }

    static async deletarLivro( req, res, next){

        try {
        
            const { error } = await supabase
                .from('livros')
                .delete()
                .eq('id', req.params.id)

    
                res.status(200).send("Livro deletado com sucesso")

        } catch (error) {
        
            res.status(500).json({ error: error.message })

        }

    }
 
}

export default LivroController;