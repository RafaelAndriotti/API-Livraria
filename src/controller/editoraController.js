import { supabase } from "../lib/supabase.js";

class EditoraController {

    static async listarEditoras(req, res, next) {
        
        //Impedindo valores absurdos de paginas
        const pagina = Math.max(1, parseInt(req.query.pagina) || 1)
        const limite = Math.min(10, parseInt(req.query.limite) || 10)

        //Calculando o range (ate quantos registros vao aparecer no site)
        const from = (pagina - 1) * limite
        const to = from + limite - 1

        const { nome_editora, pais_editora } = req.query

        // Substituiu a parte do codigo onde buscava tudo antes sem filtro
        let query = supabase
            .from('editoras')
            .select("*", { count: 'exact' })//Diz para o supabase retornar o total de registros juntos

        if(nome_editora) query = query.ilike('nome_editora', `%${nome_editora}%`)
        if(pais_editora) query=  query.ilike('pais_editora', `%${pais_editora}%`)
        
        query = query.range(from, to).order('nome_editora', { ascending: true })

        const { data, error, count } = await query

        if(error)return next(error)

        res.json({
           dados: data,
           paginacao: {
                total: count,
                pagina,
                limite,
                total_pagina: Math.ceil(count/limite)
            }
        }) 

        // const{ data, error } = await supabase

            //     .from('editoras')
            //     .select("*")

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

            res.status(200).send(`Editora atualizada com sucesso ${data.nome_editora}.`);
            

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