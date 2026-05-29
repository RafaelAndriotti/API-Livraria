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

            const { autor_nome } = req.body
            
            const { data, error } = await supabase
                .from('autores')
                .insert({ autor_nome })
                .select()
                .single()

            if(error) return res.status(500).json({ error: error.message })
        
            res.status(201).json({ message: `O autor ${autor_nome} foi cadastrado com sucesso.` })

        } catch (error) {

            res.status(500).json({ error: error.message })

        }
    }

    

}

export default AutoresController;

