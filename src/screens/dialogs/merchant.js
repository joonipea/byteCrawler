import React, { useState, useContext } from "react";
import { AppContext } from "../../appContext";
import MerchantStock from "./sub dialogs/merchantStock";

const Merchant = () => {
    const [context, setContext] = useContext(AppContext);

    const items = {
        "Rabbit's Foot": {
            description: "A lucky charm. Increases luck by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 1,
            },
        },
        "Rusty Sword": {
            description: "A rusty sword. Increases attack by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 1,
            },
        },
        "Rusty Shield": {
            description: "A rusty shield. Increases defense by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 1,
            },
        },
        "Rusty Armor": {
            description: "Rusty armor. Increases defense by 2.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 2,
            },
        },
        "Phoenix Plume": {
            description: "A phoenix plume. Allows you to revive once.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Cracked Wise Glasses": {
            description: "Wise glasses. Let's you learn more from encounters.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Oil Lamp": {
            description: "An oil lamp. Let's you see further in the dark.",
            price: Math.floor(Math.random() * 100) + 75,
        },
    };

    function showInventory() {
        setInnerText(
            <MerchantStock items={items} handleSelect={handleSelect} />
        );
    }

    const [innerText, setInnerText] = useState(
        <>
            <p>What do you want?</p>{" "}
            <button onClick={showInventory} className="btn">
                Buy
            </button>
        </>
    );

    function handleSelect(item) {
        setInnerText(
            <>
                <p>{items[item].description}</p>
                <p>{items[item].price} coins</p>
                <p>Buy?</p>
                <button onClick={() => handleBuy(item)} className="btn">
                    Yes
                </button>
                <button onClick={showInventory} className="btn">
                    No
                </button>
            </>
        );
    }

    const handleBuy = (item) => {
        if (context.gold >= items[item].price) {
            switch (items[item].params) {
                case undefined:
                    setContext((oldContext) => {
                        return {
                            ...oldContext,
                            gold: oldContext.gold - items[item].price,
                            character: {
                                ...oldContext.character,
                                inventory: oldContext.character.inventory
                                    ? [...oldContext.character.inventory, item]
                                    : [item],
                            },
                        };
                    });
                    break;
                default:
                    let [stat] = Object.keys(items[item].params);
                    let value = items[item].params[stat];
                    setContext((oldContext) => {
                        return {
                            ...oldContext,
                            gold: oldContext.gold - items[item].price,
                            character: {
                                ...oldContext.character,
                                inventory: oldContext.character.inventory
                                    ? [...oldContext.character.inventory, item]
                                    : [item],
                                stats: {
                                    ...oldContext.character.stats,
                                    [stat]:
                                        oldContext.character.stats[stat] +
                                        value,
                                },
                            },
                        };
                    });
                    break;
            }

            setInnerText(
                <>
                    <p>Thank you for your purchase</p>
                    <button onClick={showInventory} className="btn">
                        Back
                    </button>
                </>
            );
        }
    };

    return <>{innerText}</>;
};

export default Merchant;
