const Instructions = ({ instructions }) => {
    return (
        <section>
            <h2>Instructions</h2>

            <ol>
                {instructions.map((instruction, index) => (
                    <li key={index}>
                        {instruction}
                    </li>
                ))}
            </ol>
        </section>
    );
};

export default Instructions;