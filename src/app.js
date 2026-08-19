
import 'dotenv/config'
import express from "express";
import routes from './routes/index.js';
import manipuladorDeErros from './middleware/manipuladorDeErros.js';

const app = express();
app.use(express.json())

routes(app);

app.use(manipuladorDeErros);

export default app;