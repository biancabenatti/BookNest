import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectToDatabase } from './config/db.js'
import livrosRoutes from './routes/livros.js'
 
const app = express()
const PORT = process.env.PORT || 3000

// Habilita CORS para todas as origens (desenvolvimento)
app.use(cors())

app.use(express.json()) // parse do JSON

// rota publica
app.use('/', express.static('public'))

// Rotas da API de livros
app.use('/api/livros', livrosRoutes)

// favicon
app.use('/favicon.ico', express.static('public/images/pesquisa.png'))

// Conecta ao MongoDB e inicia o servidor
connectToDatabase(app).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}!`)
    })
})
