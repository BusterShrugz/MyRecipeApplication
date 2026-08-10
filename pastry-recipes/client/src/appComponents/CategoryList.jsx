const categories = [
    "All",
    "Cakes",
    "Breads",
    "Viennoiserie",
    "Pastry",
    "Cookies",
    "Sauces",
    "Creams & Custards",
    "Savory",
];

const CategoryList = ({ selectedCategory, onSelectCategory }) => {
    return (
        <nav className="category-list">
            {categories.map((category) => (
                <button
                    key={category}
                    className={
                        selectedCategory === category
                            ? "category-button active"
                            : "category-button"
                    }
                    onClick={() => onSelectCategory(category)}
                >
                    {category}
                </button>
            ))}
        </nav>
    );
};

export default CategoryList;