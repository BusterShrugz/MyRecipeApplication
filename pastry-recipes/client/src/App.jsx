import { useEffect, useState } from "react";
import { getRecipes } from "./services/recipeService";

function App() {
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

        {recipes.map((recipe) => (
            <article key={recipe._id}>
              <h2>{recipe.name}</h2>

              <p>
                Category: {recipe.category}
              </p>

              <p>
                Yield: {recipe.yield.quantity}{" "}
                {recipe.yield.unit}
              </p>

              <h3>Ingredients</h3>

              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      {ingredient.name}:{" "}
                      {ingredient.amount}
                      {ingredient.unit}
                    </li>
                ))}
              </ul>

              <h3>Instructions</h3>

              <ol>
                {recipe.instructions.map((instruction, index) => (
                    <li key={index}>
                      {instruction}
                    </li>
                ))}
              </ol>
            </article>
        ))}
      </main>
  );
}

export default App;