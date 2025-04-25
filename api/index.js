
import express from 'express'
import 'dotenv/config'
import { connectToDatabase } from './config/db.js'
import livrosRoutes from './routes/livros.js'
 
//import fs from 'fs' //fs = file system
 
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json()) //parse do JSON
//rota publica
app.use('/', express.static('public'))
//Rota
app.use('/api/livros', livrosRoutes)
//define o favicon
app.use('/favicon.ico', express.static('public/images/pesquisa.png'))
//start the serve
connectToDatabase(app).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}!`)
    })
})