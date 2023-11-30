import React, { useState, useRef, useContext } from "react";
import { AppContext } from "../../appContext";
import ITEMS from "../../assets/items";
import { addItem, changeStat } from "../../hooks/stats";

const CheatMenu = ({ setParent, bindControls }) => {
    const [context, setContext] = useContext(AppContext);
    const [consoleCheat, setConsoleCheat] = useState("");
    const output = useRef(null);

    function handleCheat(cheatString) {
        const cheat = cheatString.split(" ")[0];
        const args = cheatString.split(" ").slice(1);
        switch (cheat) {
            case undefined:
                return "enter a cheat";
            case "set":
                return handleSet(args);
            case "add":
                return handleAdd(args);
            case "remove":
                return handleRemove(args);
            default:
                return "invalid cheat";
        }
    }

    function handleSet(args) {
        const stat = args[0];
        const value = args[1];
        if (stat == "score") return setScore(value);
        if (stat == "gold") return setGold(value);
        if (!context.character.stats[stat]) return "invalid stat";
        return setStat(stat, value);
    }

    function handleAdd(args) {
        const item = args[0].replaceAll("_", " ");
        if (!context.character.inventory.includes(item)) {
            console.log(item);
            return equip(item);
        }
        return `${item} already in your inventory`;
    }

    function checkItems(item) {
        for (let list in ITEMS) {
            if (ITEMS[list][item] !== undefined) return list;
        }
        return undefined;
    }

    function equip(item) {
        const n = checkItems(item);
        if (n == undefined) return `${item} not found`;
        let [stat] = Object.keys(ITEMS[n][item].params);
        let value = ITEMS[n][item].params[stat];
        addItem(setContext, item);
        changeStat(setContext, stat, context.character.stats[stat] + value);
        setContext((oldContext) => {
            return {
                ...oldContext,
                character: {
                    ...oldContext.character,
                    inventory: [...oldContext.character.inventory, item],
                },
            };
        });
        return `added ${item} to your inventory`;
    }

    function handleRemove(args) {
        const item = args[0].replaceAll("_", " ");
        if (!context.character.inventory.includes(item)) {
            return `${item} not in your inventory`;
        }
        return removeItem(item);
    }

    function removeItem(item) {
        setContext((oldContext) => {
            return {
                ...oldContext,
                character: {
                    ...oldContext.character,
                    inventory: oldContext.character.inventory.filter(
                        (i) => i != item
                    ),
                },
            };
        });
        return `removed ${item} from your inventory`;
    }

    function setStat(stat, value) {
        if (isNaN(value)) return "invalid value";
        setContext((oldContext) => {
            return {
                ...oldContext,
                character: {
                    ...oldContext.character,
                    stats: {
                        ...oldContext.character.stats,
                        [stat]: value,
                    },
                },
            };
        });
        return `set ${stat} to ${value}`;
    }

    function setScore(value) {
        setContext((oldContext) => {
            return {
                ...oldContext,
                score: value,
            };
        });
        return `set score to ${value}`;
    }

    function setGold(value) {
        setContext((oldContext) => {
            return {
                ...oldContext,
                gold: value,
            };
        });
        return `set gold to ${value}`;
    }

    function handleSubmit(e) {
        e.preventDefault();
        output.current.innerHTML +=
            "<div>" + handleCheat(consoleCheat) + "</div>";
    }

    return (
        <div className="cheat-console">
            <div className="toolbar">
                <div className="pause-title">Cheat Menu</div>

                <button
                    className="btn"
                    onClick={() => {
                        setParent([]);
                        bindControls();
                    }}>
                    X
                </button>
            </div>
            <div className="cheat-console__output" ref={output}></div>
            <form onSubmit={handleSubmit} className="cheat-console__form">
                <input
                    value={consoleCheat}
                    onChange={(e) => setConsoleCheat(e.target.value)}
                    className="cheat-console__input"></input>
                <button type="submit" className="cheat-console__submit btn">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CheatMenu;
