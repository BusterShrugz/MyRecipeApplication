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
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
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

    const handleDelete = () => {
        setDeletePassword("");
        setError(null);
        setShowDeletePrompt(true);
    };

    const confirmDelete = async () => {
        if (!deletePassword) {
            setError("Password required to delete");
            return;
        }

        try {
            setDeleting(true);
            setError(null);

            await deleteRecipe(
                recipe._id,
                deletePassword
            );

            setShowDeletePrompt(false);
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
                Delete Recipe
            </PixelButton>

            {showDeletePrompt && (
                <div className="delete-modal-overlay">
                    <div
                        className="delete-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-modal-title"
                    >
                        <button
                            type="button"
                            className="delete-modal-close"
                            onClick={() => {
                                setShowDeletePrompt(false);
                                setDeletePassword("");
                                setError(null);
                            }}
                            aria-label="Close delete prompt"
                        >
                            ×
                        </button>

                        <h2 id="delete-modal-title">
                            Delete Recipe
                        </h2>

                        <p>
                            Enter the owner password to delete{" "}
                            <strong>{recipe.name}</strong>.
                        </p>

                        <label htmlFor="delete-password">
                            Password
                        </label>

                        <input
                            id="delete-password"
                            type="password"
                            value={deletePassword}
                            onChange={(e) =>
                                setDeletePassword(e.target.value)
                            }
                            autoFocus
                            disabled={deleting}
                        />

                        {error && (
                            <p className="form-error">
                                {error}
                            </p>
                        )}

                        <div className="delete-modal-actions">
                            <PixelButton
                                type="button"
                                onClick={() => {
                                    setShowDeletePrompt(false);
                                    setDeletePassword("");
                                    setError(null);
                                }}
                                disabled={deleting}
                            >
                                Cancel
                            </PixelButton>

                            <PixelButton
                                type="button"
                                onClick={confirmDelete}
                                disabled={deleting}
                                variant="danger"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete"}
                            </PixelButton>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Recipe;