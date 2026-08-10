import { useEffect, useState } from "react";

import { getRecipes } from "../services/recipeService";
import RecipeList from "../appComponents/RecipeList";
import CategoryList from "../appComponents/CategoryList";

const Home = ({ onSelectRecipe }) => {
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
            <h1>My Pastry Recipes</h1>

            <CategoryList
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <RecipeList
                recipes={filteredRecipes}
                onSelectRecipe={onSelectRecipe}
            />
        </main>
    );
};

export default Home;