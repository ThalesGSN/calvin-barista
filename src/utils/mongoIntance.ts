import {MongoClient, ServerApiVersion} from "mongodb";


const mongoClient = () => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
    return new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
};


export default mongoClient;
