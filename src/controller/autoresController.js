import { supabase } from '../lib/supabase.js';

class AutoresController {

    static async listarAutores (req, res) {

        try {
            const { data, error } = await supabase
                .from('autores')
                .select("*")

            res.json(data)

            } catch (error) {
            
            res.status(500).json({ error: error.message })

        }
        
    }


    static async cadastrarAutor (req, res) {
        
        try {

            const { autor_nome, nacionalidade_autor, data_nascimento, biografia } = req.body
            
            const { data, error } = await supabase
                .from('autores')
                .insert({ autor_nome, nacionalidade_autor, data_nascimento, biografia })
                .select()
                .single()

            if(error) return res.status(500).json({ error: error.message })
        
            res.status(201).json({ message: `O autor ${autor_nome} foi cadastrado com sucesso.` })

        } catch (error) {

            res.status(500).json({ error: error.message })

        }
    }

    static async listarAutorPorId (req, res) {

        try {
            
            const { data, error } = await supabase
                .from('autores')
                .select("*")
                .eq("id", req.params.id)
                .single()

            res.json(data)

            if(error) return res.status(500).json({ error: error.message })

        } catch (error) {
            
            res.status(500).json({ error: error.message })

        }
    }

    static async atualizarAutor (req, res){

        try {

            const { autor_nome, nacionalidade_autor, data_nascimento, biografia } = req.body

            const { data, error } = await supabase
                .from('autores')
                .update ({ autor_nome, nacionalidade_autor,  data_nascimento, biografia})
                .eq('id', req.params.id)
                .select()
                .single()

                res.json(`Atualizada as informacoes do autor ${autor_nome}.`)

        } catch (error) {
            
                res.status(500).json({ error: error.message })

        }

    }

    static async deletarAutor (req, res) {

        try {
            
            const { error } = await supabase
                .from('autores')
                .delete()
                .eq('id', req.params.id)

                res.status(200).send("Livro deletado com sucesso")

        } catch (error) {
            
                res.status(500).json({ error: error.message })
            
        }

    }
    

}

export default AutoresController;

