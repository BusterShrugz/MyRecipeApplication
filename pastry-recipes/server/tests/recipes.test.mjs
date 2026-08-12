import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll,
    beforeEach
} from "vitest";

import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient, ObjectId } from "mongodb";

import appModule from "../app.js";

const { app, setRecipesCollection } = appModule;

let mongoServer;
let mongoClient;
let recipesCollection;

const validRecipe = {
    name: "Chocolate Chip Cookies",
    category: "Cookies",
    subcategory: "Drop Cookies",
    yield: {
        quantity: 12,
        unit: "cookies"
    },
    ingredients: [
        {
            name: "All-purpose flour",
            amount: 250,
            unit: "g"
        },
        {
            name: "Butter",
            amount: 115,
            unit: "g"
        },
        {
            name: "Chocolate chips",
            amount: 150,
            unit: "g"
        }
    ],
    instructions: [
        "Cream the butter and sugar together.",
        "Mix in the remaining ingredients.",
        "Portion the dough onto a baking sheet.",
        "Bake until golden brown."
    ]
};

async function insertTestRecipe() {
    const recipe = structuredClone(validRecipe);

    const result =
        await recipesCollection.insertOne(recipe);

    return result.insertedId.toString();
}

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    mongoClient = new MongoClient(
        mongoServer.getUri()
    );

    await mongoClient.connect();

    const database = mongoClient.db("test-recipes");

    recipesCollection =
        database.collection("recipes");

    setRecipesCollection(recipesCollection);
});

beforeEach(async () => {
    await recipesCollection.deleteMany({});
});

afterAll(async () => {
    await mongoClient.close();
    await mongoServer.stop();
});


/* =========================================================
   GET ALL RECIPES
========================================================= */

describe("GET /api/recipes", () => {
    it("returns all recipes", async () => {
        await insertTestRecipe();

        const response = await request(app)
            .get("/api/recipes");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].name)
            .toBe("Chocolate Chip Cookies");
    });

    it("returns an empty array when there are no recipes", async () => {
        const response = await request(app)
            .get("/api/recipes");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });
});


/* =========================================================
   GET ONE RECIPE
========================================================= */

describe("GET /api/recipes/:id", () => {
    it("returns a recipe by ID", async () => {
        const recipeId =
            await insertTestRecipe();

        const response = await request(app)
            .get(`/api/recipes/${recipeId}`);

        expect(response.status).toBe(200);
        expect(response.body.name)
            .toBe("Chocolate Chip Cookies");
        expect(response.body.category)
            .toBe("Cookies");
    });

    it("returns 400 for an invalid ID", async () => {
        const response = await request(app)
            .get("/api/recipes/not-an-id");

        expect(response.status).toBe(400);
        expect(response.body.error)
            .toBe("Invalid recipe ID");
    });

    it("returns 404 when the recipe does not exist", async () => {
        const id = new ObjectId();

        const response = await request(app)
            .get(`/api/recipes/${id}`);

        expect(response.status).toBe(404);
        expect(response.body.error)
            .toBe("Recipe not found");
    });
});


/* =========================================================
   CREATE RECIPE
========================================================= */

describe("POST /api/recipes", () => {
    it("creates a valid recipe", async () => {
        const response = await request(app)
            .post("/api/recipes")
            .send(validRecipe);

        expect(response.status).toBe(201);

        expect(response.body._id)
            .toBeDefined();

        expect(response.body.name)
            .toBe("Chocolate Chip Cookies");

        expect(response.body.category)
            .toBe("Cookies");

        expect(response.body.yield.quantity)
            .toBe(12);

        const storedRecipe =
            await recipesCollection.findOne({
                _id: new ObjectId(response.body._id)
            });

        expect(storedRecipe).not.toBeNull();
        expect(storedRecipe.name)
            .toBe("Chocolate Chip Cookies");
    });

    it("sanitizes whitespace from recipe fields", async () => {
        const recipe = {
            ...validRecipe,
            name: "  Chocolate Chip Cookies  ",
            category: "Cookies",
            subcategory: "  Drop Cookies  ",
            yield: {
                quantity: 12,
                unit: " cookies "
            },
            ingredients: [
                {
                    name: "  Flour  ",
                    amount: 250,
                    unit: " g "
                }
            ],
            instructions: [
                "  Mix everything together.  "
            ]
        };

        const response = await request(app)
            .post("/api/recipes")
            .send(recipe);

        expect(response.status).toBe(201);

        expect(response.body.name)
            .toBe("Chocolate Chip Cookies");

        expect(response.body.subcategory)
            .toBe("Drop Cookies");

        expect(response.body.yield.unit)
            .toBe("cookies");

        expect(response.body.ingredients[0].name)
            .toBe("Flour");

        expect(response.body.ingredients[0].unit)
            .toBe("g");

        expect(response.body.instructions[0])
            .toBe("Mix everything together.");
    });

    it("rejects a recipe with an invalid category", async () => {
        const recipe = {
            ...validRecipe,
            category: "Invalid Category"
        };

        const response = await request(app)
            .post("/api/recipes")
            .send(recipe);

        expect(response.status).toBe(400);
        expect(response.body.error)
            .toBe("Recipe validation failed");

        expect(response.body.details)
            .toContain(
                "Category must be one of: Cakes, Breads, Viennoiserie, Pastry, Cookies, Sauces, Creams & Custards, Savory"
            );
    });

    it("rejects a recipe without a name", async () => {
        const recipe = {
            ...validRecipe,
            name: ""
        };

        const response = await request(app)
            .post("/api/recipes")
            .send(recipe);

        expect(response.status).toBe(400);
        expect(response.body.error)
            .toBe("Recipe validation failed");

        expect(response.body.details)
            .toContain("Recipe name is required");
    });

    it("rejects a recipe without ingredients", async () => {
        const recipe = {
            ...validRecipe,
            ingredients: []
        };

        const response = await request(app)
            .post("/api/recipes")
            .send(recipe);

        expect(response.status).toBe(400);
        expect(response.body.error)
            .toBe("Recipe validation failed");

        expect(response.body.details)
            .toContain(
                "At least one ingredient is required"
            );
    });

    it("rejects a recipe without instructions", async () => {
        const recipe = {
            ...validRecipe,
            instructions: []
        };

        const response = await request(app)
            .post("/api/recipes")
            .send(recipe);

        expect(response.status).toBe(400);
        expect(response.body.error)
            .toBe("Recipe validation failed");

        expect(response.body.details)
            .toContain(
                "At least one instruction is required"
            );
    });

    it("rejects unexpected fields", async () => {
        const recipe = {
            ...validRecipe,
            secretField: "should not be allowed"
        };

        const response = await request(app)
            .post("/api/recipes")
            .send(recipe);

        expect(response.status).toBe(400);
        expect(response.body.error)
            .toBe("Recipe validation failed");

        expect(
            response.body.details.some(
                (error) => error.includes("Unexpected fields: secretField")
            )
        ).toBe(true);
    });
});


/* =========================================================
   UPDATE RECIPE
========================================================= */

describe("PUT /api/recipes/:id", () => {
    it("updates an existing recipe", async () => {
        const recipeId = await insertTestRecipe();

        const updatedRecipe = {
            ...validRecipe,
            name: "Updated Chocolate Chip Cookies",
            yield: {
                quantity: 24,
                unit: "cookies"
            }
        };
        const response = await request(app)
            .put(`/api/recipes/${recipeId}`)
            .send(updatedRecipe);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Updated Chocolate Chip Cookies");

        expect(response.body.yield.quantity)
            .toBe(24);

        const storedRecipe =
            await recipesCollection.findOne({
                _id: new ObjectId(recipeId)
            });

        expect(storedRecipe.name)
            .toBe("Updated Chocolate Chip Cookies");

        expect(storedRecipe.yield.quantity)
            .toBe(24);
    });

    it("returns 400 for an invalid ID", async () => {
        const response = await request(app)
            .put("/api/recipes/not-an-id")
            .send(validRecipe);

        expect(response.status).toBe(400);
        expect(response.body.error)
            .toBe("Invalid recipe ID");
    });

    it("returns 404 when the recipe does not exist", async () => {
        const id = new ObjectId();

        const response = await request(app)
            .put(`/api/recipes/${id}`)
            .send(validRecipe);

        expect(response.status).toBe(404);
        expect(response.body.error)
            .toBe("Recipe not found");
    });

    it("rejects an invalid recipe", async () => {
        const recipeId = await insertTestRecipe();

        const invalidRecipe = {
            ...validRecipe,
            name: ""
        };

        const response = await request(app)
            .put(`/api/recipes/${recipeId}`)
            .send(invalidRecipe);

        expect(response.status).toBe(400);
        expect(response.body.error)
            .toBe("Recipe validation failed");

        expect(response.body.details)
            .toContain("Recipe name is required");
    });
});


/* =========================================================
   DELETE RECIPE
========================================================= */

describe("DELETE /api/recipes/:id", () => {
    it("deletes an existing recipe", async () => {
        const recipeId =
            await insertTestRecipe();

        const response = await request(app)
            .delete(`/api/recipes/${recipeId}`);

        expect(response.status).toBe(200);

        expect(response.body.message)
            .toBe("Recipe deleted successfully");

        const deletedRecipe =
            await recipesCollection.findOne({
                _id: new ObjectId(recipeId)
            });

        expect(deletedRecipe).toBeNull();
    });

    it("returns 400 for an invalid ID", async () => {
        const response = await request(app)
            .delete("/api/recipes/not-an-id");

        expect(response.status).toBe(400);
        expect(response.body.error)
            .toBe("Invalid recipe ID");
    });

    it("returns 404 when the recipe does not exist", async () => {
        const id = new ObjectId();

        const response = await request(app)
            .delete(`/api/recipes/${id}`);

        expect(response.status).toBe(404);
        expect(response.body.error)
            .toBe("Recipe not found");
    });
});