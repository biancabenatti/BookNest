import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swaggerConfig.js'
import { connectToDatabase } from './config/db.js';
import livrosRoutes from './routes/livros.js';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/authMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:3000',          
  'https://book-nest-hhh.vercel.app',   
];

app.use(cors({
  origin: function(origin, callback) {

    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1) {
      const msg = 'O CORS não permite acesso desta origem.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// ✅ Middleware para JSON
app.use(express.json());

// ✅ Arquivos estáticos e rota inicial
app.use('/', express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

// ✅ Middleware de erro (antes do listen)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado no servidor!');
});

// ✅ Conexão com o banco e rotas protegidas
connectToDatabase(app).then(() => {
  app.use('/api/auth', authRoutes);
  app.use('/api/livros', authMiddleware, livrosRoutes);

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}!`);
  });
}).catch(error => {
  console.error("Falha ao conectar ao banco de dados e iniciar o servidor:", error);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
