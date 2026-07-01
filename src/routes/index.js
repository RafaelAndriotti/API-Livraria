import livroRoutes from "./livrosRoutes.js"
import autoresRoutes from "./autoresRoutes.js"
import editoraRoutes from "./editoraRoutes.js"

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("Biblioteca"))
    app.use(livroRoutes)
    app.use(autoresRoutes)
    app.use(editoraRoutes)
};

export default routes