require("dotenv").config();

const { app, setRecipesCollection } = require("../server/app");
const { connectToDatabase } = require("../server/database");

let initialized = false;

async function initializeDatabase() {
    if (initialized) {
        return;
    }

    const db = await connectToDatabase();

    const recipesCollection = db.collection("recipes");

    setRecipesCollection(recipesCollection);

    initialized = true;
}

module.exports = async (req, res) => {
    try {
        await initializeDatabase();

        return app(req, res);
    } catch (error) {
        console.error("Failed to initialize database:");
        console.error(error);

        return res.status(500).json({
            error: "Failed to connect to database"
        });
    }
};