import express from "express";

const app = express();
app.use(express.json());

const livros = [

    {id: 1, titulo: "O Senhor dos Anéis"},
    {id: 2, titulo: "O Hobbit"},
    {id: 3, titulo: "O Silmarillion"}

]

app.get("/", (req, res) => {
    res.status(200).send("API RODANDO");
})

app.get("/livros", (req, res) => {
    res.status(200).json(livros);
});

app.get("/livros/:id", (req, res) => {

})

app.post("/livros", (req, res) => {
    livros.push(req.body);
    res.status(201).send("Livro adicionado com sucesso");
});

export default app;