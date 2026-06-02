import { supabase } from '../lib/supabase.js';

class LivroController {

    static async listarLivros (req, res) {
        
        const { data, error } = await supabase
            .from('livros') //Nome da tabela no supabase
            .select('*')
        
        if (error) return res.status(500).json({ error: error.message })
        res.json(data)
    }

    static async cadastrarLivro (req, res) {

        try {

             const { titulo, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse  } = req.body
            
                const { data, error } = await supabase
                    .from('livros')
                    .insert({ titulo, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse })
                    .select()
                    .single()
                
                 
            res.status(201).json({ message: `O livro ${ titulo } foi criado com sucesso` })

        } catch (error) {
        
            res.status(500).json({ error: error.message })
        
        }


    }

    static async listaLivroPorId (req, res) {

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

    static async atualizaLivro (req, res){

        try {

            const { titulo, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse } = req.body

            const { data,error } = await supabase
                .from('livros')
                .update({ titulo, isbn, preco, paginas, ano_publicacao, genero, estoque, sinopse })
                .eq('id', req.params.id)
                .select()
                .single()

    
                res.json(`Atualizado o titulo do livro, novo titulo : ${ titulo }`)

        } catch (error) {

            res.status(500).json({ error: error.message })
        
        }

    }

    static async deletarLivro( req, res){

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