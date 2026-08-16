import { useState } from "react";

const PixelButton = ({
                         children,
                         onClick,
                         type = "button",
                         variant = "default",
                         disabled = false,
                         className = "",
                         ...buttonProps
                     }) => {
    const [active, setActive] = useState(false);

    const handleClick = (event) => {
        setActive(true);

        setTimeout(() => {
            setActive(false);
        }, 300);

        if (onClick) {
            onClick(event);
        }
    };

    return (
        <button
            type={type}
            className={`pixel-button pixel-button-${variant} ${className} ${
                active ? "pixel-button-active" : ""
            }`}
            onClick={handleClick}
            disabled={disabled}
            {...buttonProps}
        >
            <span
                className="pixel-button-grid"
                aria-hidden="true"
            >
                {Array.from({ length: 12 }).map((_, rowIndex) => (
                    <span
                        className="pixel-row"
                        key={rowIndex}
                    >
                        {Array.from({ length: 12 }).map(
                            (_, pixelIndex) => (
                                <span
                                    className="pixel"
                                    key={pixelIndex}
                                />
                            )
                        )}
                    </span>
                ))}
            </span>

            <span className="pixel-button-text">
                {children}
            </span>
        </button>
    );
};

export default PixelButton;