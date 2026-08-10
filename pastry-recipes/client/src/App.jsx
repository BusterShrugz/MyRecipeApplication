import { useState } from "react";

import Home from "./appPages/Home";
import Recipe from "./appPages/Recipe";
import CreateRecipe from "./appPages/CreateRecipe";

const App = () => {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [creatingRecipe, setCreatingRecipe] = useState(false);

    if (creatingRecipe) {
        return (
            <CreateRecipe
                onBack={() => setCreatingRecipe(false)}
            />
        );
    }

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
            onCreateRecipe={() => setCreatingRecipe(true)}
        />
    );
};

export default App;