const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectToDatabase() {
    if (db) {
        return db;
    }

    await client.connect();

    db = client.db("pastry-recipes");

    console.log("Connected to Recipe-Storage DB");

    return db;
}

module.exports = {
    connectToDatabase
};