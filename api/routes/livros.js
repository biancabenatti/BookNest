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
router.put('/:id', updateLivro)

// DELETE livro
router.delete('/:id', deleteLivro)

export default router

/**
 * @swagger
 * /livros:
 *   get:
 *     summary: Retorna todos os livros (requer autenticação)
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Categoria do livro
 *       - in: query
 *         name: ordem
 *         schema:
 *           type: string
 *           enum: [maior, menor]
 *         description: Ordem da avaliação
 *     responses:
 *       200:
 *         description: Lista de livros retornada com sucesso
 *       401:
 *         description: Token ausente ou inválido
 */
/**
 * @swagger
 * /livros:
 *   post:
 *     summary: Cria um novo livro
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - autor
 *             properties:
 *               titulo:
 *                 type: string
 *               avaliacao:
 *                 type: integer
 *               autor:
 *                 type: string
 *               data_leitura:
 *                 type: string
 *                 format: date
 *               descricao:
 *                 type: string
 *               categoria:
 *                 type: string
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
/**
 * @swagger
 * /livros/{id}:
 *   get:
 *     summary: Retorna um livro pelo ID
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do livro
 *     responses:
 *       200:
 *         description: Livro encontrado
 *       404:
 *         description: Livro não encontrado
 */
/**
 * @swagger
 * /livros/{id}:
 *   put:
 *     summary: Atualiza um livro pelo ID
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               avaliacao:
 *                 type: integer
 *               autor:
 *                 type: string
 *               data_leitura:
 *                 type: string
 *                 format: date
 *               descricao:
 *                 type: string
 *               categoria:
 *                 type: string
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *       404:
 *         description: Livro não encontrado
 */
/**
 * @swagger
 * /livros/{id}:
 *   delete:
 *     summary: Deleta um livro pelo ID
 *     tags: [Livros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livro deletado com sucesso
 *       404:
 *         description: Livro não encontrado
 */

