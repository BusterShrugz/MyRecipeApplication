const IngredientList = ({ ingredients }) => {
    return (
        <section>
            <h2>Ingredients</h2>

            <ul>
                {ingredients.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient.name}: {" "}
                        {Number(ingredient.amount.toFixed(2))}{" "}
                        {ingredient.unit}
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default IngredientList;