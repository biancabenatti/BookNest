import express from 'express'
import {
  getLivros,
  getLivrosById,
  createLivro,
  updateLivro,
  deleteLivro
} from '../controllers/livros.js'
import { validateLivro } from '../middleware/validation.js'

const router = express.Router()

// GET todos os livros
router.get('/', getLivros)

// GET livro por ID
router.get('/:id', getLivrosById)

// POST novo livro
router.post('/', validateLivro, createLivro)

// PUT atualiza livro
router.put('/:id', validateLivro, updateLivro)

// DELETE livro
router.delete('/:id', deleteLivro)

export default router
