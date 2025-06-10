import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || 'biblioteca';

let client;
let usersCollection;

async function connect() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    usersCollection = db.collection('users');
  }
  return usersCollection;
}

// Cria um novo usuário, já com senha hash
export async function createUser(username, password) {
  const users = await connect();

  // Verifica se já existe usuário com o mesmo username
  const existingUser = await users.findOne({ username });
  if (existingUser) {
    throw new Error('Nome de usuário já existe.');
  }

  // Gera hash da senha
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insere o novo usuário
  const result = await users.insertOne({
    username,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return result.insertedId;
}

// Busca usuário pelo username (retorna o documento completo)
export async function findUserByUsername(username) {
  const users = await connect();
  return users.findOne({ username });
}

// Compara senha informada com a senha hash armazenada
export async function comparePassword(candidatePassword, hashedPassword) {
  return bcrypt.compare(candidatePassword, hashedPassword);
}
