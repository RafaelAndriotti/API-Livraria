import { supabase } from '../lib/supabase.js';

class AutoresController {

    static async listarAutores (req, res, next) {

        
            const { data, error } = await supabase
                .from('autores')
                .select("*")

            if(error) return next(error)
            res.json(data)

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
                .eq("autor_id", req.params.id)
                .single()

            if(error)return next(error)

            res.json(data)
 
    }

    static async atualizarAutor (req, res, next){

            const { autor_nome, nacionalidade_autor, data_nascimento, biografia } = req.body

            const { data, error } = await supabase
                .from('autores')
                .update ({ autor_nome, nacionalidade_autor,  data_nascimento, biografia})
                .eq('autor_id', req.params.id)
                .select()
                .single()

            if(error)return next(error)

                res.json(`Atualizada as informacoes do autor ${data.autor_nome}.`)

    }

    static async deletarAutor (req, res, next) {

        
            
            const { error } = await supabase
                .from('autores')
                .delete()
                .eq('autor_id', req.params.id)

            if(error)return next(error)

                res.status(200).send("Autor deletado com sucesso")

    }
    

}

export default AutoresController;

