import PixelButton from "./PixelButton";

const RecipeCard = ({ recipe, onClick }) => {
    return (
        <article className="recipe-card">
            <h2>{recipe.name}</h2>

            <p className="recipe-category">
                {recipe.category}
            </p>

            <p>
                Yield: {recipe.yield.quantity} {recipe.yield.unit}
            </p>

            <PixelButton onClick={() => onClick(recipe)}>
                View Recipe
            </PixelButton>
        </article>
    );
};

export default RecipeCard;