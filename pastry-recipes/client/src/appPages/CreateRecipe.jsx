import { useState } from "react";

import RecipeForm from "../appComponents/RecipeForm";
import { createRecipe } from "../services/recipeService";

const CreateRecipe = ({ onBack }) => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleCreateRecipe = async (recipe) => {
        try {
            setSubmitting(true);
            setError(null);
            setSuccess(false);

            await createRecipe(recipe);

            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <main className="create-recipe">
                <h1>Recipe Created!</h1>

                <p>
                    Your recipe was successfully saved.
                </p>

                <button onClick={onBack}>
                    Back to Recipes
                </button>
            </main>
        );
    }

    return (
        <main className="create-recipe">
            <button onClick={onBack}>
                ← Back to Recipes
            </button>

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            <RecipeForm
                onSubmit={handleCreateRecipe}
                submitting={submitting}
            />
        </main>
    );
};

export default CreateRecipe;