import express from "express";

const app = express();
app.use(express.json());

const livros = [

    {id: 1, titulo: "O Senhor dos Anéis"},
    {id: 2, titulo: "O Hobbit"},
    {id: 3, titulo: "O Silmarillion"}

]

//Busca os livros dentro do array LIVROS e converte o id dele para Number.
function buscaLivro (id) {
    return livros.findIndex(livro => {
        return livro.id === Number(id);
    })
}

app.get("/", (req, res) => {
    res.status(200).send("API RODANDO");
})

app.get("/livros", (req, res) => {
    res.status(200).json(livros);
});

app.get("/livros/:id", (req, res) => {
    //Variável utilizada para armzaenar o resultado da nossa função de buscaLivro
    const index = buscaLivro(req.params.id);
    res.status(200).json(livros[index]);
})

app.post("/livros", (req, res) => {
    livros.push(req.body);
    res.status(201).send("Livro adicionado com sucesso");
});

app.put("/livros/:id", (req, res) => {
    const index = buscaLivro(req.params.id);
    livros[index].titulo = req.body.titulo;
    res.status(200).json(livros[index]);
})

app.delete("/livros/:id", (req, res) => {
    const index = buscaLivro(req.params.id);
    livros.splice(index, 1);
    res.status(200).send(`Livro removido.`);
})

export default app;