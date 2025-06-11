import bcrypt from 'bcrypt';
import { connectToDatabase } from '../config/db.js';

export async function createUser(username, email, password) {
  const { db } = await connectToDatabase();
  const users = db.collection('users');

  // Verificar se já existe usuário com esse username ou email
  const existingUser = await users.findOne({
    $or: [
      { username },
      { email }
    ]
  });

  if (existingUser) {
    throw new Error('Usuário ou email já existe.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await users.insertOne({
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return result.insertedId;
}

export async function findUserByUsername(username) {
  const { db } = await connectToDatabase();
  return db.collection('users').findOne({ username });
}

export async function findUserByEmail(email) {
  const { db } = await connectToDatabase();
  return db.collection('users').findOne({ email });
}

export async function comparePassword(candidatePassword, hashedPassword) {
  return bcrypt.compare(candidatePassword, hashedPassword);
}
