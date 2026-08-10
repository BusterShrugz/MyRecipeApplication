import { useState } from "react";

import RecipeForm from "../appComponents/RecipeForm";
import { createRecipe } from "../services/recipeService";
import PixelButton from "../appComponents/PixelButton";


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

                <PixelButton onClick={onBack}>
                    Back to Recipes
                </PixelButton>
            </main>
        );
    }

    return (
        <main className="create-recipe">
            <PixelButton onClick={onBack}>
                ← Back to Recipes
            </PixelButton>

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