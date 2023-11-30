import React, { useState, useContext } from "react";
import { AppContext } from "../../appContext";
import MerchantStock from "./sub dialogs/merchantStock";
import ITEMS from "../../assets/items";
import { addItem, changeGold, changeStat } from "../../hooks/stats";

const Merchant = () => {
    const [context, setContext] = useContext(AppContext);

    const merchantLevel =
        Math.floor(context.maps.length / 10) < 10
            ? Math.floor(context.maps.length / 10)
            : 9;
    const items = ITEMS[merchantLevel];

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
                    addItem(setContext, item);
                    changeGold(setContext, context.gold - items[item].price);
                    break;
                default:
                    let [stat] = Object.keys(items[item].params);
                    let value = items[item].params[stat];
                    changeGold(setContext, context.gold - items[item].price);
                    addItem(setContext, item);
                    changeStat(
                        setContext,
                        stat,
                        context.character.stats[stat] + value
                    );
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
