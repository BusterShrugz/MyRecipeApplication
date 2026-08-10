import IngredientList from "../appComponents/IngredientList";
import Instructions from "../appComponents/Instructions";

const Recipe = ({ recipe, onBack }) => {
    if (!recipe) {
        return <p>No recipe selected.</p>;
    }

    return (
        <main className="recipe">
            <button onClick={onBack}>
                ← Back to Recipes
            </button>

            <h1>{recipe.name}</h1>

            <p>
                Category: {recipe.category}
            </p>

            <p>
                Yield: {recipe.yield.quantity}{" "}
                {recipe.yield.unit}
            </p>

            <IngredientList
                ingredients={recipe.ingredients}
            />

            <Instructions
                instructions={recipe.instructions}
            />
        </main>
    );
};

export default Recipe;