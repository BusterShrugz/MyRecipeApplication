const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

let recipesCollection;

async function startServer() {
    try {
        await client.connect();

        console.log("Connected to Recipe-Storage DB");

        const database = client.db("pastry-recipes");
        recipesCollection = database.collection("recipes");

        app.get("/api/recipes", async (req, res) => {
            try {
                const recipes = await recipesCollection.find({}).toArray();

                res.json(recipes);
            } catch (error) {
                console.error(error);

                res.status(500).json({
                    error: "Failed to retrieve recipes"
                });
            }
        });

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Failed to connect to MongoDB:");
        console.error(error);

        process.exit(1);
    }
}

startServer();