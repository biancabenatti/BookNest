import { MongoClient } from "mongodb";
let db;
const dbName = process.env.DB_NAME || "biblioteca";
export async function connectToDatabase(app){
    try{
        const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/" + dbName;
        const client = new MongoClient(MONGODB_URI)
        await client.connect()
        console.log(`Conectando ao MongoDB ${MONGODB_URI}!`)
        db = client.db(dbName)
        //Disponibiliza o db globalmente no Express
        app.locals.db = db
        return db
    } catch (error){
        console.error('Falha ao conectar ao MongoDB', error)
        process.exit(1)
    }
}



export {db}