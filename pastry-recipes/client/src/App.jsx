import { useState } from "react";

import Home from "./appPages/Home";
import Recipe from "./appPages/Recipe";

const App = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  if (selectedRecipe) {
    return (
        <Recipe
            recipe={selectedRecipe}
            onBack={() => setSelectedRecipe(null)}
        />
    );
  }

  return (
      <Home
          onSelectRecipe={setSelectedRecipe}
      />
  );
};

export default App;