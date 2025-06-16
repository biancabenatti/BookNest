import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; 

// Rota de Registro
router.post('/register', async (req, res) => {
    
    const { name, email, password } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
    }
    // Opcional: validação de formato de e-mail 
    if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ message: 'Formato de e-mail inválido.' });
    }

    try {
        const db = req.app.locals.db; 

        // Verifique se o e-mail já existe (e-mail será único)
        const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() }); 

        if (existingUser) {
            return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10); 
        // Inserir o novo usuário no banco de dados
        await db.collection('users').insertOne({ 
            name, 
            email: email.toLowerCase(), // Salvar e-mail em minúsculas
            password: hashedPassword // Salvar a senha criptografada
        });

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });

    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao registrar usuário.' });
    }
});


// Rota de Login
router.post('/login', async (req, res) => {
    // Agora esperamos 'email' e 'password'
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const db = req.app.locals.db; 

        // Encontrar o usuário pelo e-mail
        const user = await db.collection('users').findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' }); // E-mail não encontrado
        }

        // Comparar a senha fornecida com a senha criptografada no banco de dados
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' }); // Senha incorreta
        }

        // Gerar o token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name }, // Adicionar 'name' ao payload do token
            JWT_SECRET,
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        res.status(200).json({ message: 'Login bem-sucedido!', token });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao fazer login.' });
    }
});


export default router;