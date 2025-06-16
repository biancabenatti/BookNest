import request from 'supertest';
import { MongoClient } from 'mongodb';
import app from '../index.js';
import dotenv from 'dotenv';
dotenv.config();

let connection;
let db;
let insertedId;

beforeAll(async () => {
  connection = await MongoClient.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = connection.db('biblioteca');
  app.locals.db = db; 
});

afterAll(async () => {
  await db.dropDatabase(); 
  await connection.close();
});

describe('API Livros - Testes CRUD (sem token)', () => {
  it('[POST] Deve criar um novo livro', async () => {
    const response = await request(app)
      .post('/api/livros')
      .send({
        titulo: 'Livro Teste Sem Mongoose',
        autor: 'Autor Puro MongoDB',
        descricao: 'Testando sem Mongoose',
        data_leitura: '2025-06-16',
        avaliacao: 4,
        categoria: 'ficcao'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    insertedId = response.body._id.toString();
  });

  it('[GET] Deve listar todos os livros', async () => {
    const response = await request(app).get('/api/livros');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('[GET] Deve buscar um livro pelo ID', async () => {
    const response = await request(app).get(`/api/livros/${insertedId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('_id', insertedId);
  });

  it('[PUT] Deve atualizar um livro', async () => {
    const response = await request(app)
      .put(`/api/livros/${insertedId}`)
      .send({
        titulo: 'Livro Atualizado Sem Mongoose'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.livro.titulo).toBe('Livro Atualizado Sem Mongoose');
  });

  it('[DELETE] Deve deletar um livro', async () => {
    const response = await request(app).delete(`/api/livros/${insertedId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch(/removido/i);
  });
});
afterAll(() => {
  
  if (global.__MONGOCLIENT__) {
    global.__MONGOCLIENT__.close();
  }
});