import { useState } from "react";

import IngredientList from "../appComponents/IngredientList";
import Instructions from "../appComponents/Instructions";
import { deleteRecipe } from "../services/recipeService";
import PixelButton from "../appComponents/PixelButton";

const Recipe = ({ recipe, onBack, onDeleted }) => {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    if (!recipe) {
        return <p>No recipe selected.</p>;
    }

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${recipe.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError(null);

            await deleteRecipe(recipe._id);

            onDeleted();
        } catch (err) {
            setError(err.message);
            setDeleting(false);
        }
    };

    return (
        <main className="recipe">
            <PixelButton onClick={onBack}>
                ← Back to Recipes
            </PixelButton>

            <h1>{recipe.name}</h1>

            <p>
                Category: {recipe.category}
            </p>

            {recipe.subcategory && (
                <p>
                    Subcategory: {recipe.subcategory}
                </p>
            )}

            <p>
                Yield: {recipe.yield.quantity}{" "}
                {recipe.yield.unit}
            </p>

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            <IngredientList
                ingredients={recipe.ingredients}
            />

            <Instructions
                instructions={recipe.instructions}
            />

            <PixelButton
                onClick={handleDelete}
                disabled={deleting}
                variant="danger"
            >
                {deleting ? "Deleting..." : "Delete Recipe"}
            </PixelButton>
        </main>
    );
};

export default Recipe;