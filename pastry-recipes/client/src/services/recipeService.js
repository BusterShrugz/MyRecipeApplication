const API_URL = "http://localhost:5050/api";

export async function getRecipes() {
    const response = await fetch(`${API_URL}/recipes`);

    if (!response.ok) {
        throw new Error("Failed to fetch recipes");
    }

    return response.json();
}

export async function createRecipe(recipe) {
    const response = await fetch(`${API_URL}/recipes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(recipe)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to create recipe");
    }

    return data;
}