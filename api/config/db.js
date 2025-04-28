import { MongoClient } from "mongodb";
let db;
export async function connectToDatabase(app){
    try{
        const MONGODB_URI = process.env.MONGODB_URI 
        const client = new MongoClient(MONGODB_URI)
        await client.connect()
        console.log(`Conectando ao MongoDB ${MONGODB_URI}!`)
        const dbName = process.env.DB_NAME || 'biblioteca'; 
        db = client.db(dbName);
        //Disponibiliza o db globalmente no Express
        app.locals.db = db
        return db
    } catch (error){
        console.error('Falha ao conectar ao MongoDB', error)
        process.exit(1)
    }
}

export {db}