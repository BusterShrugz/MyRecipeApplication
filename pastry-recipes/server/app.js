const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");

const {
    validateRecipe,
    sanitizeRecipe
} = require("./recipeValidation");

const app = express();

app.use(cors());
app.use(express.json());

let recipesCollection;

function setRecipesCollection(collection) {
    recipesCollection = collection;
}

// GET all recipes
app.get("/api/recipes", async (req, res) => {
    try {
        const recipes = await recipesCollection
            .find({})
            .toArray();

        res.json(recipes);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve recipes"
        });
    }
});

// GET one recipe
app.get("/api/recipes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid recipe ID"
            });
        }

        const recipe = await recipesCollection.findOne({
            _id: new ObjectId(id)
        });

        if (!recipe) {
            return res.status(404).json({
                error: "Recipe not found"
            });
        }

        res.json(recipe);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve recipe"
        });
    }
});

// CREATE recipe
app.post("/api/recipes", async (req, res) => {
    try {
        const validation = validateRecipe(req.body);

        if (!validation.valid) {
            return res.status(400).json({
                error: "Recipe validation failed",
                details: validation.errors
            });
        }

        const recipe = sanitizeRecipe(req.body);

        const result = await recipesCollection.insertOne(recipe);

        const createdRecipe = await recipesCollection.findOne({
            _id: result.insertedId
        });

        res.status(201).json(createdRecipe);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create recipe"
        });
    }
});

// UPDATE recipe
app.put("/api/recipes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid recipe ID"
            });
        }

        const validation = validateRecipe(req.body);

        if (!validation.valid) {
            return res.status(400).json({
                error: "Recipe validation failed",
                details: validation.errors
            });
        }

        const recipe = sanitizeRecipe(req.body);

        const result = await recipesCollection.replaceOne(
            { _id: new ObjectId(id) },
            recipe
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                error: "Recipe not found"
            });
        }

        const updatedRecipe = await recipesCollection.findOne({
            _id: new ObjectId(id)
        });

        res.json(updatedRecipe);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to update recipe"
        });
    }
});

// DELETE recipe
app.delete("/api/recipes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(401).json({
                error: "Password required to delete"
            });
        }

        if (password !== process.env.DELETE_RECIPE_PASSWORD) {
            return res.status(403).json({
                error: "Incorrect password"
            });
        }

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid recipe ID"
            });
        }

        const result = await recipesCollection.deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: "Recipe not found"
            });
        }

        res.json({
            message: "Recipe deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to delete recipe"
        });
    }
});

module.exports = {
    app,
    setRecipesCollection
};