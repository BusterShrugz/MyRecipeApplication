import PixelButton from "./PixelButton";

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
                <PixelButton
                    key={category}
                    className={
                        selectedCategory === category
                            ? "category-button active"
                            : "category-button"
                    }
                    onClick={() => onSelectCategory(category)}
                >
                    {category}
                </PixelButton>
            ))}
        </nav>
    );
};

export default CategoryList;