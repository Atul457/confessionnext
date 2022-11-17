import React from "react";

const Loader = ({
    color = "#2E4C6D",
    size = "sm",
    isPageLoader = false,
    className = null,
}) => {

    // Functions
    const sizeFn = () => {
        if (isPageLoader) return "60";
        switch (size) {
            case "xsm":
                return "15";
            case "sm":
                return "20";
            case "md":
                return "25";
            case "lg":
                return "30";
            case "xl":
                return "40";
        }
    };

    return (
        <div
            role="status"
            style={{ color, width: `${sizeFn()}px`, height: `${sizeFn()}px` }}
            className={`${className ? className : ""} spinner-border`}></div>
    );
};

export default Loader;