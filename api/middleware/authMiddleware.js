import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUsername, comparePassword } from '../model/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
  
  if (password.length < 6)
    return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });

  try {
    await createUser(name, email, password);
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    if (error.message === 'Email já existe.') {
      return res.status(409).json({ message: error.message });
    }
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao registrar usuário.' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });

  try {
    const user = await findUserByUsername(username);
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao fazer login.' });
  }
});

export default router;
