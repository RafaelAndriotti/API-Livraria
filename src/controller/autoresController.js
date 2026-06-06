import { supabase } from '../lib/supabase.js';

class AutoresController {

    static async listarAutores (req, res, next) {

        try {
            const { data, error } = await supabase
                .from('autores')
                .select("*")

            res.json(data)

            } catch (error) {
            
            res.status(500).json({ error: error.message })

        }
        
    }


    static async cadastrarAutor (req, res, next) {
        
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

    static async listarAutorPorId (req, res, next) {

        try {
            
            const { data, error } = await supabase
                .from('autores')
                .select("*")
                .eq("autor_id", req.params.id)
                .single()

            if(error) return res.status(500).json({ error: error.message })

            res.json(data)

        } catch (error) {
            
            res.status(500).json({ error: error.message })

        }
    }

    static async atualizarAutor (req, res, next){

        try {

            const { autor_nome, nacionalidade_autor, data_nascimento, biografia } = req.body

            const { data, error } = await supabase
                .from('autores')
                .update ({ autor_nome, nacionalidade_autor,  data_nascimento, biografia})
                .eq('autor_id', req.params.id)
                .select()
                .single()

                res.json(`Atualizada as informacoes do autor ${data.autor_nome}.`)

        } catch (error) {
            
                res.status(500).json({ error: error.message })

        }

    }

    static async deletarAutor (req, res, next) {

        try {
            
            const { error } = await supabase
                .from('autores')
                .delete()
                .eq('autor_id', req.params.id)

                res.status(200).send("Autor deletado com sucesso")

        } catch (error) {
            
                res.status(500).json({ error: error.message })
            
        }

    }
    

}

export default AutoresController;

