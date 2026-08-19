import jwt from 'jsonwebtoken';
import ErroAutenticacao from '../errors/ErroAutenticacao.js';

// Middleware que protege rotas: exige um JWT válido no header Authorization.
function autenticacao(req, res, next) {
    const header = req.headers.authorization

    if (!header) return next(new ErroAutenticacao("Token nao informado"))

    // Formato esperado: "Bearer <token>"
    const [esquema, token] = header.split(' ')

    if (esquema !== 'Bearer' || !token) {
        return next(new ErroAutenticacao("Formato de token invalido"))
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // Disponibiliza os dados do usuário autenticado para os controllers.
        req.usuario = { id: payload.sub, email: payload.email }
        next()
    } catch {
        return next(new ErroAutenticacao("Token invalido ou expirado"))
    }
}

export default autenticacao;
