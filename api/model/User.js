import bcrypt from 'bcrypt';
import { connectToDatabase } from '../config/db.js';

export async function createUser(username, password) {
  const { db } = await connectToDatabase();
  const users = db.collection('users');

  const existingUser = await users.findOne({ username });
  if (existingUser) {
    throw new Error('Usuário já existe.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await users.insertOne({
    username,
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

export async function comparePassword(candidatePassword, hashedPassword) {
  return bcrypt.compare(candidatePassword, hashedPassword);
}