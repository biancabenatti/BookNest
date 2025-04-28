import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectToDatabase } from './config/db.js';
import livrosRoutes from './routes/livros.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://book-nest-phi.vercel.app', // Seu domínio de frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type'] // Cabeçalhos permitidos
}))

app.use(express.json()) // parse do JSON

// rota publica
app.use('/', express.static('public'))

// Rotas da API de livros
app.use('/api/livros', livrosRoutes)

// Conecta ao MongoDB e inicia o servidor
connectToDatabase(app).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}!`)
    })
})