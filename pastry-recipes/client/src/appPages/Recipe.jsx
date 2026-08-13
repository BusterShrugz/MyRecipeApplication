import {useState} from "react";

import IngredientList from "../appComponents/IngredientList";
import Instructions from "../appComponents/Instructions";
import {deleteRecipe} from "../services/recipeService";
import PixelButton from "../appComponents/PixelButton";

import {scaleRecipe} from "../utility/scaleRecipe";
import {formatAmount} from "../utility/formatAmount";

const Recipe = ({recipe, onBack, onDeleted}) => {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [desiredYield, setDesiredYield] = useState(
        recipe?.yield?.quantity ?? 1
    );

    if (!recipe) {
        return <p>No recipe selected.</p>;
    }

    const scaledRecipe = scaleRecipe(
        recipe,
        desiredYield
    );

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

    const handleYieldChange = (value) => {
        const newYield = Number(value);

        if (newYield >= 1) {
            setDesiredYield(newYield);
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

            <div className="recipe-scaler">
                <label htmlFor="yield">
                    Servings:
                </label>

                <PixelButton
                    type="button"
                    onClick={() =>
                        handleYieldChange(desiredYield - 1)
                    }
                    disabled={isLocked || desiredYield <= 1}
                >
                    −
                </PixelButton>

                <input
                    id="yield"
                    type="number"
                    min="1"
                    value={desiredYield}
                    disabled={isLocked}
                    onChange={(e) =>
                        handleYieldChange(e.target.value)
                    }
                />

                <PixelButton
                    type="button"
                    onClick={() =>
                        handleYieldChange(desiredYield + 1)
                    }
                    disabled={isLocked}
                >
                    +
                </PixelButton>

                <span>
                    {recipe.yield.unit}
                </span>

                <button
                    type="button"
                    className={`pixel-lock ${isLocked ? "locked" : ""}`}
                    onClick={() => setIsLocked((locked) => !locked)}
                    aria-label={
                        isLocked
                            ? "Unlock recipe scale"
                            : "Lock recipe scale"
                    }
                    title={
                        isLocked
                            ? "Unlock recipe scale"
                            : "Lock recipe scale"
                    }
                >
                    {isLocked ? "🔒" : "🔓"}
                </button>
            </div>

            <p>
                Original yield:{" "}
                {recipe.yield.quantity}{" "}
                {recipe.yield.unit}
            </p>

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            <IngredientList
                ingredients={scaledRecipe.ingredients}
                formatAmount={formatAmount}
            />

            <Instructions
                instructions={recipe.instructions}
            />

            <PixelButton
                onClick={handleDelete}
                disabled={deleting}
                variant="danger"
            >
                {deleting
                    ? "Deleting..."
                    : "Delete Recipe"}
            </PixelButton>
        </main>
    );
};

export default Recipe;