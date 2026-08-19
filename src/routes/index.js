import livroRoutes from "./livrosRoutes.js"
import autoresRoutes from "./autoresRoutes.js"
import editoraRoutes from "./editoraRoutes.js"
import authRoutes from "./authRoutes.js"

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("Biblioteca"))
    app.use(authRoutes)
    app.use(livroRoutes)
    app.use(autoresRoutes)
    app.use(editoraRoutes)
};

export default routes