import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../appContext";

const Temple = ({ setScore }) => {
    const [goldNeeded, setGoldNeeded] = useState(0);
    const [context, setContext] = useContext(AppContext);
    const [innerText, setInnerText] = useState(null);

    useEffect(() => {
        let expNeeded =
            context.character.level ** 1.3 * context.character.rarity * 500;
        let nextLevel = expNeeded - context.score;
        setGoldNeeded(Math.ceil(nextLevel / 5));
        setInnerText(
            <p>You feel a being beyond your understanding stare down at you.</p>
        );
    }, []);

    const donate = () => {
        if (context.gold >= goldNeeded) {
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    gold: oldContext.gold - goldNeeded,
                };
            });
            setScore((oldScore) => oldScore + goldNeeded * 5);
        }
    };
    return (
        <>
            Temple
            {innerText}
            <button
                disabled={context.gold < goldNeeded}
                onClick={donate}
                className="btn">
                Leave {goldNeeded} coins at the altar
            </button>
        </>
    );
};

export default Temple;
