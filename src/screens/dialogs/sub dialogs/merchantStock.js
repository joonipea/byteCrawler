import React, { useContext } from "react";
import { AppContext } from "../../../appContext";

const MerchantStock = ({ items, handleSelect }) => {
    const [context, setContext] = useContext(AppContext);
    return (
        <div className="merchant--items-container">
            {Object.keys(items).map((item) => (
                <button
                    disabled={
                        context.gold < items[item].price ||
                        (context.character.inventory &&
                            context.character.inventory.includes(item))
                    }
                    onClick={() => handleSelect(item)}
                    className="btn merchant--item-btn">
                    <div className="merchant--item-sprite">
                        <img
                            src={`./sprites/${item}.png`}
                            alt={items[item].description}
                            width={`36`}
                            height={`36`}></img>
                    </div>
                    <span className="merchant--item-name">
                        {context.character.inventory &&
                        context.character.inventory.includes(item)
                            ? "SOLD OUT"
                            : item}
                    </span>
                    <span className="merchant--item-price">
                        {items[item].price}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default MerchantStock;
