import { useEffect, useState } from "react";

import { getRecipes } from "../services/recipeService";
import RecipeList from "../appComponents/RecipeList";
import CategoryList from "../appComponents/CategoryList";
import PixelButton from "../appComponents/PixelButton";

const Home = ({ onSelectRecipe, onCreateRecipe }) => {
    const [recipes, setRecipes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadRecipes() {
            try {
                const data = await getRecipes();
                setRecipes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadRecipes();
    }, []);

    if (loading) {
        return <p>Loading recipes...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const filteredRecipes =
        selectedCategory === "All"
            ? recipes
            : recipes.filter(
                (recipe) => recipe.category === selectedCategory
            );

    return (
        <main className="home">

            <header className="home-header">
                <div className="home-title">
                    <p className="home-eyebrow">Welcome to my recipe collection!</p>
                    <h1>Recipes</h1>
                    <span className="recipe-count">
                        {filteredRecipes.length} recipes total - so far
                    </span>
                    <p className="home-subtitle">
                        Recipes, ingredients, and instructions all in one place.
                    </p>
                </div>

                <PixelButton onClick={onCreateRecipe}>
                    + Add Recipe
                </PixelButton>
            </header>

            <section className="home-categories">
                <CategoryList
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </section>

            <section className="home-recipes">
                <div className="recipe-section-header">
                    <h2>
                        {selectedCategory === "All"
                            ? "All"
                            : selectedCategory}
                    </h2>

                    <span className="recipe-count">
                    {filteredRecipes.length}{" "}
                        {filteredRecipes.length === 1 ? "recipe" : "recipes"}
                </span>
                </div>

                <RecipeList
                    recipes={filteredRecipes}
                    onSelectRecipe={onSelectRecipe}
                />
            </section>

        </main>
    );
};

export default Home;