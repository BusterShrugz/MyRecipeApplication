import RecipeCard from "./RecipeCard";

const RecipeList = ({ recipes, onSelectRecipe }) => {
    if (recipes.length === 0) {
        return <p>No recipes found.</p>;
    }

    return (
        <section className="recipe-list">
            {recipes.map((recipe) => (
                <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    onClick={onSelectRecipe}
                />
            ))}
        </section>
    );
};

export default RecipeList;