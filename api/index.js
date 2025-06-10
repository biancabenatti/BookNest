
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { connectToDatabase } from './config/db.js'; // Apenas a função connectToDatabase
import livrosRoutes from './routes/livros.js';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/authMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://book-nest-phi.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/', express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});


connectToDatabase(app).then(() => {

    app.use('/api/auth', authRoutes);
    app.use('/api/livros', authMiddleware, livrosRoutes);

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}!`);
    });
}).catch(error => {
    console.error("Falha ao conectar ao banco de dados e iniciar o servidor:", error);

});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo deu errado no servidor!');
});