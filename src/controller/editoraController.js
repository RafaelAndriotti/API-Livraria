import { supabase } from "../lib/supabase.js";

class EditoraController {

    static async listarEditoras(req, res, next) {
            
            const{ data, error } = await supabase

                .from('editoras')
                .select("*")

            if(error)return next(error)

            res.json(data)

    }

    static async cadastrarEditora (req, res, next) {
            
            const{ nome_editora, pais_editora, site_editora, email_contato} = req.body

            // eslint-disable-next-line no-unused-vars
            const { data, error } = await supabase
                .from('editoras')
                .insert({ nome_editora, pais_editora, site_editora, email_contato })
                .select()
                .single()
            
            if(error) return next(error)

            res.status(201).send(`A editora ${nome_editora} foi criada com sucesso.`);

        
    }

    static async listarEditoraPorId (req, res, next) {
   
            const { data, error } = await supabase
                .from('editoras')
                .select("*")
                .eq('id', req.params.id)
                .select()
                .single()

            if(error)return next(error)

            res.json(data)    

    }

    static async atualizarEditora (req, res, next) {

            const{ nome_editora, pais_editora, site_editora, email_contato} = req.body

            const { data, error } = await supabase
            .from('editoras')
            .update({ nome_editora, pais_editora, site_editora, email_contato })
            .eq("id", req.params.id)
            .select()
            .single()

            if(error)return next(error)

            res.status(201).send(`Editora atualizada com sucesso ${data.nome_editora}.`);
            

    }

    static async deletarEditora (req, res, next) {
  
            const { error } = await supabase
                .from('editoras')
                .delete()
                .eq("id", req.params.id)

            if(error)return next(error)

            res.status(200).send("Editora deletada com sucesso.")

    }

}

export default EditoraController;