// controllers/livros.js (ou livrosController.js, dependendo do nome do seu arquivo)
import { ObjectId } from 'mongodb';

// GET - Com filtro e sem filtro
export const getLivros = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { categoria, ordem } = req.query;

        const filtro = {};
        const options = {};

        if (categoria) {
            filtro.categoria = categoria;
        }

        if (ordem === 'maior') {
            options.sort = { avaliacao: -1 };
        } else if (ordem === 'menor') {
            options.sort = { avaliacao: 1 };
        }

        const livros = await db.collection('livros').find(filtro, options).toArray();
        res.status(200).json(livros);
    } catch (error) {

        console.error('Erro ao buscar livros:', error);
        res.status(500).json({ error: true, message: 'Erro interno do servidor ao buscar livros.' });
    }
};

// GET - Livro por ID
export const getLivrosById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = req.app.locals.db;


        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch (error) {

            return res.status(400).json({ error: true, message: 'ID de livro inválido.' });
        }

        const livro = await db.collection('livros').findOne({ _id: objectId });

        if (!livro) {
            return res.status(404).json({ error: true, message: 'Livro não encontrado.' });
        }
        res.status(200).json(livro);
    } catch (error) {
        console.error('Erro ao buscar livro por ID:', error);
        res.status(500).json({ error: true, message: 'Erro interno do servidor ao buscar livro por ID.' });
    }
};

// POST - Criar novo livro
export const createLivro = async (req, res) => {
    try {
        const { titulo, avaliacao, autor, data_leitura, descricao, categoria } = req.body;
        const db = req.app.locals.db;

        const novoLivro = {
            titulo,
            avaliacao,
            autor,

            data_leitura: data_leitura ? new Date(data_leitura) : null,
            descricao,
            categoria
        };

        const result = await db.collection('livros').insertOne(novoLivro);

        res.status(201).json({ _id: result.insertedId, ...novoLivro });
    } catch (error) {
        console.error('Erro ao criar livro:', error);
        res.status(500).json({ error: true, message: 'Erro interno do servidor ao inserir o livro.' });
    }
};

// PUT - Atualizar livro por ID
export const updateLivro = async (req, res) => {
    try {
        const { id } = req.params;
        const db = req.app.locals.db;


        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch (error) {
            return res.status(400).json({ error: true, message: 'ID de livro inválido para atualização.' });
        }

        const camposAtualizar = {};
        // Adiciona campos ao objeto de atualização apenas se eles existirem no body
        if (req.body.titulo !== undefined) camposAtualizar.titulo = req.body.titulo;
        if (req.body.avaliacao !== undefined) camposAtualizar.avaliacao = req.body.avaliacao;
        if (req.body.autor !== undefined) camposAtualizar.autor = req.body.autor;
        // Converte data_leitura para Date se for fornecido
        if (req.body.data_leitura !== undefined) camposAtualizar.data_leitura = req.body.data_leitura ? new Date(req.body.data_leitura) : null;
        if (req.body.descricao !== undefined) camposAtualizar.descricao = req.body.descricao;
        if (req.body.categoria !== undefined) camposAtualizar.categoria = req.body.categoria; // Adicionado categoria para atualização

        const result = await db.collection('livros').updateOne(
            { _id: objectId }, // Usa o ObjectId convertido
            { $set: camposAtualizar }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: true, message: 'Livro não encontrado para atualização.' });
        }

        const livroAtualizado = await db.collection('livros').findOne({ _id: objectId });

        res.status(200).json({
            message: 'Livro atualizado com sucesso!',
            livro: livroAtualizado
        });
    } catch (error) {
        console.error('Erro ao atualizar livro:', error);
        res.status(500).json({ error: true, message: 'Erro interno do servidor ao atualizar o livro.' });
    }
};

// DELETE - Remover livro por ID
export const deleteLivro = async (req, res) => {
    try {
        const { id } = req.params;
        const db = req.app.locals.db;

        // **CORREÇÃO CRÍTICA AQUI:** Converte a string 'id' para ObjectId
        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch (error) {
            return res.status(400).json({ error: true, message: 'ID de livro inválido para exclusão.' });
        }

        const result = await db.collection('livros').deleteOne({ _id: objectId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: true, message: 'Livro não encontrado para exclusão.' });
        }

        res.status(200).json({ message: 'Livro removido com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar livro:', error);
        res.status(500).json({ error: true, message: 'Erro interno do servidor ao deletar o livro.' });
    }
};