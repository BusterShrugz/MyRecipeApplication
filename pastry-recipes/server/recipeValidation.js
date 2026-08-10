const VALID_CATEGORIES = [
    "Cakes",
    "Breads",
    "Viennoiserie",
    "Pastry",
    "Cookies",
    "Sauces",
    "Creams & Custards",
    "Savory"
];

const ALLOWED_FIELDS = [
    "name",
    "category",
    "subcategory",
    "yield",
    "ingredients",
    "instructions"
];

function validateRecipe(recipe) {
    const errors = [];

    if (!recipe || typeof recipe !== "object" || Array.isArray(recipe)) {
        return {
            valid: false,
            errors: ["Recipe must be an object"]
        };
    }

    // Check for unexpected fields
    const unexpectedFields = Object.keys(recipe).filter(
        (field) => !ALLOWED_FIELDS.includes(field)
    );

    if (unexpectedFields.length > 0) {
        errors.push(
            `Unexpected fields: ${unexpectedFields.join(", ")}`
        );
    }

    // Name
    if (
        typeof recipe.name !== "string" ||
        !recipe.name.trim()
    ) {
        errors.push("Recipe name is required");
    }

    // Category
    if (
        typeof recipe.category !== "string" ||
        !VALID_CATEGORIES.includes(recipe.category)
    ) {
        errors.push(
            `Category must be one of: ${VALID_CATEGORIES.join(", ")}`
        );
    }

    // Subcategory
    if (
        recipe.subcategory !== undefined &&
        typeof recipe.subcategory !== "string"
    ) {
        errors.push("Subcategory must be a string");
    }

    // Yield
    if (!recipe.yield || typeof recipe.yield !== "object") {
        errors.push("Yield is required");
    } else {
        if (
            typeof recipe.yield.quantity !== "number" ||
            !Number.isFinite(recipe.yield.quantity) ||
            recipe.yield.quantity <= 0
        ) {
            errors.push("Yield quantity must be a positive number");
        }

        if (
            typeof recipe.yield.unit !== "string" ||
            !recipe.yield.unit.trim()
        ) {
            errors.push("Yield unit is required");
        }
    }

    // Ingredients
    if (
        !Array.isArray(recipe.ingredients) ||
        recipe.ingredients.length === 0
    ) {
        errors.push("At least one ingredient is required");
    } else {
        recipe.ingredients.forEach((ingredient, index) => {
            if (!ingredient || typeof ingredient !== "object") {
                errors.push(
                    `Ingredient ${index + 1} must be an object`
                );
                return;
            }

            if (
                typeof ingredient.name !== "string" ||
                !ingredient.name.trim()
            ) {
                errors.push(
                    `Ingredient ${index + 1} requires a name`
                );
            }

            if (
                typeof ingredient.amount !== "number" ||
                !Number.isFinite(ingredient.amount) ||
                ingredient.amount <= 0
            ) {
                errors.push(
                    `Ingredient ${index + 1} amount must be a positive number`
                );
            }

            if (
                typeof ingredient.unit !== "string" ||
                !ingredient.unit.trim()
            ) {
                errors.push(
                    `Ingredient ${index + 1} requires a unit`
                );
            }
        });
    }

    // Instructions
    if (
        !Array.isArray(recipe.instructions) ||
        recipe.instructions.length === 0
    ) {
        errors.push("At least one instruction is required");
    } else {
        recipe.instructions.forEach((instruction, index) => {
            if (
                typeof instruction !== "string" ||
                !instruction.trim()
            ) {
                errors.push(
                    `Instruction ${index + 1} cannot be empty`
                );
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

function sanitizeRecipe(recipe) {
    return {
        name: recipe.name.trim(),
        category: recipe.category.trim(),
        subcategory: recipe.subcategory?.trim() || "",
        yield: {
            quantity: recipe.yield.quantity,
            unit: recipe.yield.unit.trim()
        },
        ingredients: recipe.ingredients.map((ingredient) => ({
            name: ingredient.name.trim(),
            amount: ingredient.amount,
            unit: ingredient.unit.trim()
        })),
        instructions: recipe.instructions.map(
            (instruction) => instruction.trim()
        )
    };
}

module.exports = {
    VALID_CATEGORIES,
    validateRecipe,
    sanitizeRecipe
};