import { ObjectId } from "mongodb"
// GET - Com filtro 
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
        console.error(error);
        res.status(500).json({ error: true, message: 'Erro ao buscar livros' });
    }
}

// GET - Livro por ID
export const getLivrosById = async (req, res) => {
    try {
        const { id } = req.params
        const db = req.app.locals.db
        const livro = await db.collection('livros').findOne({ _id: ObjectId.createFromHexString(id) })
        if (!livro) {
            return res.status(404).json({ error: true, message: 'Livro não encontrado' })
        }
        res.status(200).json(livro)
    } catch (error) {
        res.status(500).json({ error: true, message: 'Erro ao buscar livro por ID' })
        console.error(error)
    }
}

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
        console.error('Erro ao criar livro', error);
        res.status(500).json({ error: true, message: 'Erro ao inserir o livro' });
    }
}

// PUT - Atualizar livro por ID
export const updateLivro = async (req, res) => {
    try {
        const { id } = req.params
        const { titulo, avaliacao, autor, data_leitura, descricao } = req.body
        const db = req.app.locals.db

        const result = await db.collection('livros').updateOne(
            { _id: ObjectId.createFromHexString(id) },
            {
                $set: {
                    titulo,
                    avaliacao,
                    autor,
                    data_leitura: data_leitura ? new Date(data_leitura) : null,
                    descricao
                }
            }
        )

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: true, message: 'Livro não encontrado' })
        }

        res.status(200).json({ message: 'Livro atualizado com sucesso' })
    } catch (error) {
        console.error('Erro ao atualizar livro', error)
        res.status(500).json({ error: true, message: 'Erro ao atualizar o livro' })
    }
}

// DELETE - Remover livro por ID
export const deleteLivro = async (req, res) => {
    try {
        const { id } = req.params
        const db = req.app.locals.db

        const result = await db.collection('livros').deleteOne({ _id: ObjectId.createFromHexString(id) })

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: true, message: 'Livro não encontrado' })
        }

        res.status(200).json({ message: 'Livro removido com sucesso' })
    } catch (error) {
        console.error('Erro ao deletar livro', error)
        res.status(500).json({ error: true, message: 'Erro ao deletar o livro' })
    }
}

