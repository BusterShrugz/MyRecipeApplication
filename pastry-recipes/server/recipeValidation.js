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

const VALID_DIFFICULTIES = [
    "Easy",
    "Intermediate",
    "Advanced"
];

const VALID_TEMPERATURE_UNITS = [
    "F",
    "C"
];

const VALID_ALLERGENS = [
    "Wheat",
    "Milk",
    "Eggs",
    "Soy",
    "Peanuts",
    "Tree Nuts",
    "Sesame",
    "Fish",
    "Shellfish"
];

const VALID_DIETARY_TAGS = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Egg-Free",
    "Nut-Free",
    "Low-Sugar"
];

const ALLOWED_FIELDS = [
    "name",
    "category",
    "subcategory",
    "yield",
    "ingredients",
    "instructions",
    "prepTime",
    "cookTime",
    "temperature",
    "difficulty",
    "equipment",
    "allergens",
    "dietaryTags",
    "notes",
    "imageUrl",
    "source",
    "origin",
    "createdAt",
    "updatedAt"
];

const MAX_RECIPE_TIME = 1440; //24 hrs

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
    // allergens
    if (recipe.allergens !== undefined) {
        if (!Array.isArray(recipe.allergens)) {
            errors.push("Allergens must be an array");
        } else {
            recipe.allergens.forEach((allergen) => {
                if (!VALID_ALLERGENS.includes(allergen)) {
                    errors.push(
                        `Invalid allergen: ${allergen}`
                    );
                }
            });
        }
    }
    //dietary
    if (recipe.dietaryTags !== undefined) {
        if (!Array.isArray(recipe.dietaryTags)) {
            errors.push("Dietary tags must be an array");
        } else {
            recipe.dietaryTags.forEach((tag) => {
                if (!VALID_DIETARY_TAGS.includes(tag)) {
                    errors.push(
                        `Invalid dietary tag: ${tag}`
                    );
                }
            });
        }
    }

    // Equipment
    if (recipe.equipment !== undefined) {
        if (!Array.isArray(recipe.equipment)) {
            errors.push("Equipment must be an array");
        } else {
            recipe.equipment.forEach((item, index) => {
                if (
                    typeof item !== "string" ||
                    !item.trim()
                ) {
                    errors.push(
                        `Equipment item ${index + 1} must be a non-empty string`
                    );
                }
            });
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

// Prep time
    if (recipe.prepTime !== undefined) {
        if (
            typeof recipe.prepTime !== "number" ||
            !Number.isFinite(recipe.prepTime) ||
            recipe.prepTime < 0
        ) {
            errors.push(
                "Prep time must be a non-negative number"
            );
        } else if (recipe.prepTime > MAX_RECIPE_TIME) {
            errors.push(
                "Prep time cannot exceed 24 hours"
            );
        }
    }

// Cook time
    if (recipe.cookTime !== undefined) {
        if (
            typeof recipe.cookTime !== "number" ||
            !Number.isFinite(recipe.cookTime) ||
            recipe.cookTime < 0
        ) {
            errors.push(
                "Cook time must be a non-negative number"
            );
        } else if (recipe.cookTime > MAX_RECIPE_TIME) {
            errors.push(
                "Cook time cannot exceed 24 hours"
            );
        }
    }

    // Temperature
    if (
        recipe.temperature !== undefined &&
        recipe.temperature !== null
    ) {
        if (
            !recipe.temperature ||
            typeof recipe.temperature !== "object"
        ) {
            errors.push("Temperature must be an object");
        } else {
            if (
                typeof recipe.temperature.value !== "number" ||
                !Number.isFinite(recipe.temperature.value)
            ) {
                errors.push(
                    "Temperature value must be a number"
                );
            }

            if (
                typeof recipe.temperature.unit !== "string" ||
                !VALID_TEMPERATURE_UNITS.includes(
                    recipe.temperature.unit
                )
            ) {
                errors.push(
                    "Temperature unit must be F or C"
                );
            }
        }
    }

    if (
        recipe.temperature !== undefined &&
        recipe.temperature !== null &&
        typeof recipe.temperature === "object"
    ) {
        const { value, unit } = recipe.temperature;

        if (
            typeof value === "number" &&
            Number.isFinite(value) &&
            typeof unit === "string" &&
            VALID_TEMPERATURE_UNITS.includes(unit)
        ) {
            if (unit === "F" && (value < 32 || value > 1000)) {
                errors.push(
                    "Temperature must be between 32°F and 1000°F"
                );
            }

            if (unit === "C" && (value < 0 || value > 540)) {
                errors.push(
                    "Temperature must be between 0°C and 540°C"
                );
            }
        }
    }

    // Difficulty
    if (
        recipe.difficulty !== undefined &&
        !VALID_DIFFICULTIES.includes(recipe.difficulty)
    ) {
        errors.push(
            `Difficulty must be one of: ${VALID_DIFFICULTIES.join(", ")}`
        );
    }

    // Notes
    if (
        recipe.notes !== undefined &&
        typeof recipe.notes !== "string"
    ) {
        errors.push("Notes must be a string");
    }

    // Image URL
    if (
        recipe.imageUrl !== undefined &&
        recipe.imageUrl !== ""
    ) {
        if (typeof recipe.imageUrl !== "string") {
            errors.push("Image URL must be a string");
        } else {
            try {
                const url = new URL(recipe.imageUrl);

                if (!["http:", "https:"].includes(url.protocol)) {
                    errors.push(
                        "Image URL must use HTTP or HTTPS"
                    );
                }
            } catch {
                errors.push("Image URL must be a valid URL");
            }
        }
    }

    // Source
    if (
        recipe.source !== undefined &&
        typeof recipe.source !== "string"
    ) {
        errors.push("Source must be a string");
    }

    // Origin
    if (
        recipe.origin !== undefined &&
        typeof recipe.origin !== "string"
    ) {
        errors.push("Origin must be a string");
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
        ),

        prepTime: recipe.prepTime ?? 0,
        cookTime: recipe.cookTime ?? 0,

        temperature: recipe.temperature
            ? {
                value: recipe.temperature.value,
                unit: recipe.temperature.unit
            }
            : null,

        difficulty: recipe.difficulty || "",

        equipment: Array.isArray(recipe.equipment)
            ? recipe.equipment.map((item) => item.trim()).filter(Boolean)
            : [],

        allergens: Array.isArray(recipe.allergens)
            ? recipe.allergens.map((item) => item.trim()).filter(Boolean)
            : [],

        dietaryTags: Array.isArray(recipe.dietaryTags)
            ? recipe.dietaryTags.map((item) => item.trim()).filter(Boolean)
            : [],

        notes: recipe.notes?.trim() || "",
        imageUrl: recipe.imageUrl?.trim() || "",
        source: recipe.source?.trim() || "",
        origin: recipe.origin?.trim() || ""
    };
}

module.exports = {
    VALID_CATEGORIES,
    VALID_DIFFICULTIES,
    VALID_TEMPERATURE_UNITS,
    VALID_ALLERGENS,
    VALID_DIETARY_TAGS,
    validateRecipe,
    sanitizeRecipe
};