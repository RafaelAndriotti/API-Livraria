import 'dotenv/config'
import express from "express";
import { supabase } from './lib/supabase.js'
import routes from './routes/index.js';

const app = express();
routes(app);

//Rota para listar todos os livros cadastrados 
// app.get("/livros", async (req, res) => {
    
//     const { data, error } = supabase
//         .from('livros') //Nome da tabela no supabase
//         .select('*')

//     if (error) return res.status(500).json({ error: error.message })
//     res.json(data)    
// });

//Rota para buscar somente um livro
app.get("/livros/:id", async (req, res) => {
     
    const { data, error } = await supabase
        .from('livros')
        .select('*')
        .eq('id', req.params.id)
        .single()
    
    if (error) return res.status(404).json({ error: 'Livro não encontrado' })
    res.json(data)
})

//Rota para criar os livros
app.post("/livros", async (req, res) => {
     
    const { titulo } = req.body

    const { data, error } = await supabase
        .from('livros')
        .insert({ titulo })
        .select()
        .single()
    
    if (error) return res.status(500).json({ error: error.message })
    res.status(201).json(data)

});

//Rota para alterar a informação de um livro
app.put("/livros/:id", async (req, res) => {

    const { titulo } = req.body

    const { data,error } = await supabase
        .from('livros')
        .update({ titulo })
        .eq('id', req.params.id)
        .select()
        .single()

    if (error) return res.status(500).json({ error: error.message })
    res.json(data) 

})

app.delete("/livros/:id", async (req, res) => {
     
    const { error } = await supabase
        .from('livros')
        .delete()
        .eq('id', req.params.id)

    if (error) return res.status(500).json({ error: error.message })
    res.status(204).send()

})

export default app;