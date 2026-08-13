export function scaleRecipe(recipe, desiredYield) {
    if (!recipe?.yield?.quantity || !desiredYield) {
        return recipe;
    }

    const factor =
        desiredYield / recipe.yield.quantity;

    return {
        ...recipe,

        yield: {
            ...recipe.yield,
            quantity: desiredYield
        },

        ingredients: recipe.ingredients.map((ingredient) => ({
            ...ingredient,
            amount: ingredient.amount * factor
        }))
    };
}