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

        // GET all recipes
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

// CREATE a new recipe
        app.post("/api/recipes", async (req, res) => {
            try {
                const {
                    name,
                    category,
                    subcategory,
                    yield: recipeYield,
                    ingredients,
                    instructions
                } = req.body;

                // Required fields
                if (!name || !category || !recipeYield || !ingredients || !instructions) {
                    return res.status(400).json({
                        error: "Missing required recipe fields"
                    });
                }

                // Validate yield
                if (
                    typeof recipeYield.quantity !== "number" ||
                    !recipeYield.unit
                ) {
                    return res.status(400).json({
                        error: "Yield must contain a numeric quantity and unit"
                    });
                }

                // Validate ingredients
                if (
                    !Array.isArray(ingredients) ||
                    ingredients.length === 0
                ) {
                    return res.status(400).json({
                        error: "Recipe must contain at least one ingredient"
                    });
                }

                for (const ingredient of ingredients) {
                    if (
                        !ingredient.name ||
                        typeof ingredient.amount !== "number" ||
                        !ingredient.unit
                    ) {
                        return res.status(400).json({
                            error:
                                "Each ingredient must contain a name, numeric amount, and unit"
                        });
                    }
                }

                // Validate instructions
                if (
                    !Array.isArray(instructions) ||
                    instructions.length === 0
                ) {
                    return res.status(400).json({
                        error: "Recipe must contain at least one instruction"
                    });
                }

                for (const instruction of instructions) {
                    if (typeof instruction !== "string" || !instruction.trim()) {
                        return res.status(400).json({
                            error: "Each instruction must contain text"
                        });
                    }
                }

                const recipe = {
                    name: name.trim(),
                    category: category.trim(),
                    subcategory: subcategory?.trim() || "",
                    yield: {
                        quantity: recipeYield.quantity,
                        unit: recipeYield.unit.trim()
                    },
                    ingredients,
                    instructions
                };

                const result = await recipesCollection.insertOne(recipe);

                res.status(201).json({
                    message: "Recipe created successfully",
                    recipeId: result.insertedId
                });

            } catch (error) {
                console.error(error);

                res.status(500).json({
                    error: "Failed to create recipe"
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