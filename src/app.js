
import 'dotenv/config'
import express from "express";
// eslint-disable-next-line no-unused-vars
import { supabase } from './lib/supabase.js'
import routes from './routes/index.js';
import manipuladorDeErros from './middleware/manipuladorDeErros.js';

const app = express();
routes(app);

app.use(manipuladorDeErros);

export default app;