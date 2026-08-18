import { useState } from "react";
import PixelButton from "./PixelButton";


const categories = [
    "Cakes",
    "Breads",
    "Viennoiserie",
    "Pastry",
    "Cookies",
    "Sauces",
    "Creams & Custards",
    "Savory",
];

const allergensList = [
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

const dietaryTagList = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Egg-Free",
    "Nut-Free",
    "Low-Sugar"
];

const RecipeForm = ({ onSubmit, submitting = false }) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");

    const [yieldQuantity, setYieldQuantity] = useState("");
    const [yieldUnit, setYieldUnit] = useState("");

    const [prepTime, setPrepTime] = useState("");
    const [cookTime, setCookTime] = useState("");

    const [temperatureValue, setTemperatureValue] = useState("");
    const [temperatureUnit, setTemperatureUnit] = useState("F");

    const [difficulty, setDifficulty] = useState("");

    const [equipment, setEquipment] = useState([""]);
    const [allergens, setAllergens] = useState([]);
    const [dietaryTags, setDietaryTags] = useState([]);

    const [notes, setNotes] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [source, setSource] = useState("");
    const [origin, setOrigin] = useState("");

    const [formError, setFormError] = useState("");

    const addEquipment = () => {
        setEquipment((current) => [...current, ""]);
    };

    const removeEquipment = (index) => {
        setEquipment((current) =>
            current.filter((_, i) => i !== index)
        );
    };

    const handleEquipmentChange = (index, value) => {
        setEquipment((current) =>
            current.map((item, i) =>
                i === index ? value : item
            )
        );
    };

    const toggleAllergen = (allergen) => {
        setAllergens((current) =>
            current.includes(allergen)
                ? current.filter((item) => item !== allergen)
                : [...current, allergen]
        );
    };

    const toggleDietaryTag = (tag) => {
        setDietaryTags((current) =>
            current.includes(tag)
                ? current.filter((item) => item !== tag)
                : [...current, tag]
        );
    };

    const [ingredients, setIngredients] = useState([
        {
            name: "",
            amount: "",
            unit: ""
        }
    ]);

    const [instructions, setInstructions] = useState([""]);

    const handleIngredientChange = (index, field, value) => {
        setIngredients((currentIngredients) =>
            currentIngredients.map((ingredient, i) =>
                i === index
                    ? {
                        ...ingredient,
                        [field]: value
                    }
                    : ingredient
            )
        );
    };

    const addIngredient = () => {
        setIngredients((currentIngredients) => [
            ...currentIngredients,
            {
                name: "",
                amount: "",
                unit: ""
            }
        ]);
    };

    const removeIngredient = (index) => {
        setIngredients((currentIngredients) =>
            currentIngredients.filter((_, i) => i !== index)
        );
    };

    const handleInstructionChange = (index, value) => {
        setInstructions((currentInstructions) =>
            currentInstructions.map((instruction, i) =>
                i === index ? value : instruction
            )
        );
    };

    const addInstruction = () => {
        setInstructions((currentInstructions) => [
            ...currentInstructions,
            ""
        ]);
    };

    const removeInstruction = (index) => {
        setInstructions((currentInstructions) =>
            currentInstructions.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormError("");

        if (!name.trim()) {
            setFormError("Recipe name is required.");
            return;
        }

        if (!category) {
            setFormError("Please select a category.");
            return;
        }

        const quantity = Number(yieldQuantity);

        if (!yieldQuantity || !Number.isFinite(quantity) || quantity <= 0) {
            setFormError("Yield quantity must be greater than 0.");
            return;
        }

        if (!yieldUnit.trim()) {
            setFormError("Yield unit is required.");
            return;
        }

        const invalidIngredient = ingredients.some(
            (ingredient) =>
                !ingredient.name.trim() ||
                !ingredient.amount ||
                Number(ingredient.amount) <= 0 ||
                !ingredient.unit.trim()
        );

        if (invalidIngredient) {
            setFormError(
                "Every ingredient must have a name, positive amount, and unit."
            );
            return;
        }

        const validInstructions = instructions
            .map((instruction) => instruction.trim())
            .filter(Boolean);

        if (validInstructions.length === 0) {
            setFormError(
                "At least one instruction is required."
            );
            return;
        }

        const prep = Number(prepTime);
        const cook = Number(cookTime);
        const temperature = Number(temperatureValue);

        if (
            prepTime !== "" &&
            (!Number.isFinite(prep) || prep < 0)
        ) {
            setFormError(
                "Prep time must be 0 or greater."
            );
            return;
        }

        if (
            cookTime !== "" &&
            (!Number.isFinite(cook) || cook < 0)
        ) {
            setFormError(
                "Bake / cook time must be 0 or greater."
            );
            return;
        }

        if (
            temperatureValue !== "" &&
            (!Number.isFinite(temperature) || temperature < 0)
        ) {
            setFormError(
                "Temperature must be 0 or greater."
            );
            return;
        }

        if (imageUrl.trim()) {
            try {
                const url = new URL(imageUrl.trim());

                if (!["http:", "https:"].includes(url.protocol)) {
                    setFormError(
                        "Image URL must use HTTP or HTTPS."
                    );
                    return;
                }
            } catch {
                setFormError(
                    "Please enter a valid image URL."
                );
                return;
            }
        }

        const recipe = {
            name: name.trim(),
            category,
            subcategory: subcategory.trim(),

            yield: {
                quantity,
                unit: yieldUnit.trim()
            },

            ingredients: ingredients.map((ingredient) => ({
                name: ingredient.name.trim(),
                amount: Number(ingredient.amount),
                unit: ingredient.unit.trim()
            })),

            instructions: validInstructions,

            prepTime: prepTime === "" ? 0 : prep,
            cookTime: cookTime === "" ? 0 : cook,

            temperature: temperatureValue
                ? {
                    value: temperature,
                    unit: temperatureUnit
                }
                : null,

            difficulty,

            equipment: equipment
                .map((item) => item.trim())
                .filter(Boolean),

            allergens,
            dietaryTags,

            notes: notes.trim(),
            imageUrl: imageUrl.trim(),
            source: source.trim(),
            origin: origin.trim()
        };

        try {
            await onSubmit(recipe);
        } catch (error) {
            setFormError(
                error.message || "Failed to save recipe."
            );
        }
    };

    return (
        <form className="recipe-form" onSubmit={handleSubmit}>
            <h1>Create Recipe</h1>

            <div className="form-group">
                <label htmlFor="name">
                    Recipe Name
                </label>

                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g The best recipe ever."
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="category">
                        Recipe type
                    </label>

                    <select
                        id="category"
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value)
                        }
                        required
                    >
                        <option value="">
                            Select recipe type
                        </option>

                        {categories.map((categoryName) => (
                            <option
                                key={categoryName}
                                value={categoryName}
                            >
                                {categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="subcategory">
                        Recipe sub-type
                    </label>

                    <input
                        id="subcategory"
                        type="text"
                        value={subcategory}
                        onChange={(event) =>
                            setSubcategory(event.target.value)
                        }
                        placeholder="e.g. Layer Cakes"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Servings / Amount made</label>

                <div className="form-row">
                    <input
                        type="number"
                        min="0.00"
                        step="any"
                        value={yieldQuantity}
                        onChange={(event) =>
                            setYieldQuantity(event.target.value)
                        }
                        placeholder="Quantity"
                        required
                    />

                    <input
                        type="text"
                        value={yieldUnit}
                        onChange={(event) =>
                            setYieldUnit(event.target.value)
                        }
                        placeholder="Grams, Ounces, etc..."
                        required
                    />
                </div>
            </div>

            <section className="form-section">
                <h2>Recipe Details</h2>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="prep-time">
                            Prep Time (minutes)
                        </label>

                        <input
                            id="prep-time"
                            type="number"
                            min="0"
                            step="1"
                            value={prepTime}
                            onChange={(event) =>
                                setPrepTime(event.target.value)
                            }
                            placeholder="e.g. 30"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="cook-time">
                            Bake / Cook Time (minutes)
                        </label>

                        <input
                            id="cook-time"
                            type="number"
                            min="0"
                            step="1"
                            value={cookTime}
                            onChange={(event) =>
                                setCookTime(event.target.value)
                            }
                            placeholder="e.g. 25"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="temperature">
                            Temperature
                        </label>

                        <input
                            id="temperature"
                            type="number"
                            value={temperatureValue}
                            onChange={(event) =>
                                setTemperatureValue(event.target.value)
                            }
                            placeholder="e.g. 375"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="temperature-unit">
                            Unit
                        </label>

                        <select
                            id="temperature-unit"
                            value={temperatureUnit}
                            onChange={(event) =>
                                setTemperatureUnit(event.target.value)
                            }
                        >
                            <option value="F">°F</option>
                            <option value="C">°C</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="difficulty">
                            Difficulty
                        </label>

                        <select
                            id="difficulty"
                            value={difficulty}
                            onChange={(event) =>
                                setDifficulty(event.target.value)
                            }
                        >
                            <option value="">
                                Select difficulty
                            </option>
                            <option value="Easy">
                                Easy
                            </option>
                            <option value="Intermediate">
                                Intermediate
                            </option>
                            <option value="Advanced">
                                Advanced
                            </option>
                        </select>
                    </div>
                </div>
            </section>

            <section className="form-section form-list-section">
                <h2>Equipment Needed</h2>

                {equipment.map((item, index) => (
                    <div
                        className="ingredient-row"
                        key={index}
                    >
                        <input
                            type="text"
                            value={item}
                            placeholder="e.g. Stand mixer"
                            onChange={(event) =>
                                handleEquipmentChange(
                                    index,
                                    event.target.value
                                )
                            }
                        />

                        {equipment.length > 1 && (
                            <PixelButton
                                type="button"
                                onClick={() =>
                                    removeEquipment(index)
                                }
                            >
                                Remove
                            </PixelButton>
                        )}
                    </div>
                ))}

                <PixelButton
                    type="button"
                    onClick={addEquipment}
                >
                    + Add Equipment
                </PixelButton>
            </section>

            <section className="form-section">
                <h2>Allergens</h2>

                <div className="tag-selector">
                    {allergensList.map((allergen) => {
                        const selected = allergens.includes(allergen);

                        return (
                            <PixelButton
                                key={allergen}
                                type="button"
                                className={
                                    selected
                                        ? "tag selected"
                                        : "tag"
                                }
                                onClick={() => toggleAllergen(allergen)}
                                aria-pressed={selected}
                            >
                                {selected && "✓ "}
                                {allergen}
                            </PixelButton>
                        );
                    })}
                </div>
            </section>

            <section className="form-section">
                <h2>Dietary Restrictions</h2>

                <div className="tag-selector">
                    {dietaryTagList.map((tag) => {
                        const selected = dietaryTags.includes(tag);

                        return (
                            <PixelButton
                                key={tag}
                                type="button"
                                className={
                                    selected
                                        ? "tag selected"
                                        : "tag"
                                }
                                onClick={() => toggleDietaryTag(tag)}
                                aria-pressed={selected}
                            >
                                {selected && "✓ "}
                                {tag}
                            </PixelButton>
                        );
                    })}
                </div>
            </section>

            <section className="form-section form-list-section">
                <h2>Ingredients</h2>

                {ingredients.map((ingredient, index) => (
                    <div className="ingredient-row" key={index}>
                        <input
                            type="text"
                            placeholder="Ingredient"
                            value={ingredient.name}
                            onChange={(event) =>
                                handleIngredientChange(
                                    index,
                                    "name",
                                    event.target.value
                                )
                            }
                            required
                        />

                        <input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="Amount"
                            value={ingredient.amount}
                            onChange={(event) =>
                                handleIngredientChange(
                                    index,
                                    "amount",
                                    event.target.value
                                )
                            }
                            required
                        />

                        <input
                            type="text"
                            placeholder="Unit"
                            value={ingredient.unit}
                            onChange={(event) =>
                                handleIngredientChange(
                                    index,
                                    "unit",
                                    event.target.value
                                )
                            }
                            required
                        />

                        {ingredients.length > 1 && (
                            <PixelButton
                                type="button"
                                onClick={() => removeIngredient(index)}
                            >
                                Remove
                            </PixelButton>
                        )}
                    </div>
                ))}

                <PixelButton
                    type="button"
                    onClick={addIngredient}
                >
                    + Add Ingredient
                </PixelButton>
            </section>

            <section className="form-section form-list-section">
                <h2>Instructions</h2>

                {instructions.map((instruction, index) => (
                    <div
                        className="instruction-row"
                        key={index}
                    >
                        <span>{index + 1}.</span>

                        <textarea
                            value={instruction}
                            onChange={(event) =>
                                handleInstructionChange(
                                    index,
                                    event.target.value
                                )
                            }
                            placeholder={`Instruction #${index + 1}`}
                            required
                        />

                        {instructions.length > 1 && (
                            <PixelButton
                                type="button"
                                onClick={() => removeInstruction(index)}
                            >
                                Remove
                            </PixelButton>
                        )}
                    </div>
                ))}

                <PixelButton
                    type="button"
                    onClick={addInstruction}
                >
                    + Add Instruction
                </PixelButton>
            </section>

            <section className="form-section">
                <h2>Additional Information</h2>

                <div className="form-group">
                    <label htmlFor="image-url">
                        Recipe Image URL
                    </label>

                    <input
                        id="image-url"
                        type="url"
                        value={imageUrl}
                        onChange={(event) =>
                            setImageUrl(event.target.value)
                        }
                        placeholder="https://..."
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="source">
                            Recipe Source
                        </label>

                        <input
                            id="source"
                            type="text"
                            value={source}
                            onChange={(event) =>
                                setSource(event.target.value)
                            }
                            placeholder="e.g. Personal recipe"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="origin">
                            Where's it from?
                        </label>

                        <input
                            id="origin"
                            type="text"
                            value={origin}
                            onChange={(event) =>
                                setOrigin(event.target.value)
                            }
                            placeholder="e.g. U.S.A"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="notes">
                        Recipe Notes
                    </label>

                    <textarea
                        id="notes"
                        value={notes}
                        onChange={(event) =>
                            setNotes(event.target.value)
                        }
                        placeholder="Add helpful notes about this recipe..."
                        rows="5"
                    />
                </div>
            </section>

            {formError && (
                <p
                    className="form-error"
                    role="alert"
                >
                    {formError}
                </p>
            )}

            <PixelButton
                type="submit"
                disabled={submitting}
            >
                {submitting ? "Saving..." : "Save Recipe"}
            </PixelButton>
        </form>
    );
};

export default RecipeForm;