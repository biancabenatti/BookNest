import { MongoClient } from "mongodb";

let dbInstance; 

export async function connectToDatabase(app) {
    try {
        if (dbInstance) { 
            console.log('Já conectado ao MongoDB. Reutilizando conexão existente.');
            app.locals.db = dbInstance; 
            return dbInstance;
        }

        const MONGODB_URI = process.env.MONGO_URI;
        if (!MONGODB_URI) {
            throw new Error("Variável de ambiente MONGO_URI não definida.");
        }

        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log(`Conectando ao MongoDB ${MONGODB_URI}!`);
        const dbName = process.env.DB_NAME || 'biblioteca';
        dbInstance = client.db(dbName);

  
        app.locals.db = dbInstance;
        return dbInstance;
    } catch (error) {
        console.error('Falha ao conectar ao MongoDB', error);
        process.exit(1);
    }
}

