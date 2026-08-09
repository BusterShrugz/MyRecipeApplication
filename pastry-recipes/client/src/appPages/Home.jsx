import { useEffect, useState } from "react";

import { getRecipes } from "../services/recipeService";
import RecipeList from "../appComponents/RecipeList";

const Home = ({ onSelectRecipe }) => {
    const [recipes, setRecipes] = useState([]);
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

    return (
        <main>
            <h1>My Pastry Recipes</h1>

            <RecipeList
                recipes={recipes}
                onSelectRecipe={onSelectRecipe}
            />
        </main>
    );
};

export default Home;