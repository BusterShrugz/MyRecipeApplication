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

            <button onClick={() => onClick(recipe)}>
                View Recipe
            </button>
        </article>
    );
};

export default RecipeCard;