import React, { useContext } from "react";
import { AppContext } from "../../../appContext";

const MerchantStock = ({ items, handleSelect }) => {
    const [context, setContext] = useContext(AppContext);
    return (
        <>
            {Object.keys(items).map((item) => (
                <button
                    disabled={
                        context.gold < items[item].price ||
                        (context.character.inventory &&
                            context.character.inventory.includes(item))
                    }
                    onClick={() => handleSelect(item)}
                    className="btn">
                    {context.character.inventory &&
                    context.character.inventory.includes(item)
                        ? "SOLD OUT"
                        : item}
                </button>
            ))}
        </>
    );
};

export default MerchantStock;
