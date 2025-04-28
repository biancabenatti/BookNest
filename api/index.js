import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectToDatabase } from './config/db.js';
import livrosRoutes from './routes/livros.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Primeiro registra as rotas da API
app.use('/api/livros', livrosRoutes);

// Depois registra os arquivos estáticos
app.use('/', express.static('public'));

// Conecta ao MongoDB e inicia o servidor
connectToDatabase(app).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}!`);
  });
});
