import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectToDatabase } from './config/db.js';
import livrosRoutes from './routes/livros.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Função para obter a URL da API, dependendo do ambiente
function obterApiUrl() {
    return process.env.NODE_ENV === 'production'
        ? 'https://book-nest-steel.vercel.app/'  
        : 'http://localhost:3000';      
}

app.use(cors());

// Middleware para parse de JSON
app.use(express.json());

// Rota pública - serve arquivos estáticos da pasta 'public'
app.use('/', express.static('public'));

// Rotas da API de livros
app.use('/api/livros', livrosRoutes);

// Favicon
app.use('/favicon.ico', express.static('public/images/pesquisa.png'));

// Conecta ao MongoDB e inicia o servidor
connectToDatabase(app).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}!`);
    });
});