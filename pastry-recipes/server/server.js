const { MongoClient } = require("mongodb");
require("dotenv").config();

const { app, setRecipesCollection } = require("./app");

const PORT = process.env.PORT || 5050;

const client = new MongoClient(process.env.MONGODB_URI);

async function startServer() {
    try {
        await client.connect();

        console.log("Connected to Recipe-Storage DB");

        const database = client.db("pastry-recipes");

        const recipesCollection =
            database.collection("recipes");

        setRecipesCollection(recipesCollection);

        app.listen(PORT, () => {
            console.log(
                `Server running at http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:");
        console.error(error);

        process.exit(1);
    }
}

startServer();