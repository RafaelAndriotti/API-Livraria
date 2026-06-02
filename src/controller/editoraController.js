import { supabase } from "../lib/supabase.js";

class EditoraController {

    static async listarEditoras(req, res) {

        try {
            
            const{ data, error } = await supabase

                .from('editoras')
                .select("*")

            res.json(data)

        } catch (error) {

            res.status(500).json({ error: error.message })

        }

    }

    static async cadastrarEditora (req, res) {

        try {
            
            const{ nome_editora, pais_editora, site_editora, email_contato} = req.body

            const { data, error } = await supabase
                .from('editoras')
                .insert({ nome_editora, pais_editora, site_editora, email_contato })
                .select()
                .single()
            
            if(error) return res.status(500).json({ error: error.message });

            res.status(201).send(`A editora ${nome_editora} foi criada com sucesso.`);

        } catch (error) {
            
            res.status(500).json({ error: error.message });

        }
    }

    static async listarEditoraPorId (req, res) {

        try {
            
            const { data, error } = await supabase
                .from('editoras')
                .select("*")
                .eq('id', req.params.id)
                .select()
                .single()

            res.json(data)    

            if(error) return res.status(500).json({ error: error.message });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    static async atualizarEditora (req, res) {

        try {

            const{ nome_editora, pais_editora, site_editora, email_contato} = req.body

            const { data, error } = await supabase
            .from('editoras')
            .insert({ nome_editora, pais_editora, site_editora, email_contato })
            .select()
            .single()

            res.status(201).send("Editora atualizada com sucesso.");
        
        } catch (error) {
            
            res.status(500).json({ error: error.message })

        }
            

    }

    static async deletarEditora (req, res) {

        try {
            
            const { error } = await supabase
                .from('editoras')
                .delete()
                .eq("id", req.params.id)

                res.status(200).send("Editora deletada com sucesso.")

        } catch (error) {
            
            res.status(500).json({ error: error.message })

        }

    }

}

export default EditoraController;