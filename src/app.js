import 'dotenv/config'
import express from "express";
import { supabase } from './lib/supabase.js'
import routes from './routes/index.js';

const app = express();
routes(app);

export default app;