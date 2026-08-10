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

const RecipeForm = ({ onSubmit, submitting = false }) => {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");

    const [yieldQuantity, setYieldQuantity] = useState("");
    const [yieldUnit, setYieldUnit] = useState("");

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

        const recipe = {
            name: name.trim(),
            category,
            subcategory: subcategory.trim(),
            yield: {
                quantity: Number(yieldQuantity),
                unit: yieldUnit.trim()
            },
            ingredients: ingredients.map((ingredient) => ({
                name: ingredient.name.trim(),
                amount: Number(ingredient.amount),
                unit: ingredient.unit.trim()
            })),
            instructions: instructions
                .map((instruction) => instruction.trim())
                .filter(Boolean)
        };

        await onSubmit(recipe);
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
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="category">
                        Category
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
                            Select category
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
                        Subcategory
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
                <label>Yield</label>

                <div className="form-row">
                    <input
                        type="number"
                        min="0"
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
                        placeholder="Unit"
                        required
                    />
                </div>
            </div>

            <section className="form-section">
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

            <section className="form-section">
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
                            placeholder={`Step ${index + 1}`}
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
                    + Add Step
                </PixelButton>
            </section>

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