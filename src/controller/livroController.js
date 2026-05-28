import { supabase } from '../lib/supabase.js';

class LivroController {

    static async listarLivros (req, res) {
        
        const { data, error } = supabase
            .from('livros') //Nome da tabela no supabase
            .select('*')
        
        if (error) return res.status(500).json({ error: error.message })
        res.json(data)
    }

    static async cadastrarLivro (req, res) {

        try {

             const { titulo } = req.body
            
                const { data, error } = await supabase
                    .from('livros')
                    .insert({ titulo })
                    .select()
                    .single()
                
                 
            res.status(201).json(data)

        } catch (error) {
        
            res.status(500).json({ error: error.message })
        
        }


    }

}

export default LivroController;