import React, { useContext, useState } from "react";
import SettingsModal from "./settingsModal";
import DeckModal from "./deckModal";
import { AppContext } from "../../appContext";

const StatusModal = ({ setParent }) => {
    const [context, setContext] = useContext(AppContext);
    const [playerStats, setPlayerStats] = useState(() => {
        let stats = [];
        for (const [key, stat] of Object.entries(context.character.stats)) {
            if (key == "health" || key == "maxHealth") continue;
            stats.push(
                <div key={key}>
                    {key}: {stat}
                </div>
            );
        }
        return stats;
    });
    const [inventory, setInventory] = useState(() => {
        let inv = [];
        if (!context.character.inventory) return inv;
        for (const [key, item] of context.character.inventory.entries()) {
            inv.push(
                <div
                    key={key}
                    style={{ backgroundImage: `url("./sprites/${item}.jpg")` }}
                    className="item-sprite"></div>
            );
        }
        return inv;
    });

    return (
        <>
            <div className="player-container">
                <div className="player-display">
                    <div className="player-name">
                        {context.character.name.replace(/_/g, " ")}
                    </div>
                    <div className="player-sprite"></div>
                </div>
                <div className="player-stats">
                    <div className="player-battler-hp-bar">
                        <div
                            className="player-battler-hp-bar--inner"
                            style={{
                                width: `${
                                    (context.character.stats.health /
                                        context.character.stats.maxHealth) *
                                    100
                                }%`,
                            }}></div>
                    </div>
                    <div className="player-battler-hp">
                        {context.character.stats.health}/
                        {context.character.stats.maxHealth} HP
                    </div>
                    {playerStats}
                </div>
            </div>
            <div className="player-inventory">{inventory}</div>
            <div className="btn-container--horizontal">
                <button
                    onClick={() =>
                        setParent(<DeckModal setParent={setParent}></DeckModal>)
                    }
                    className="btn">
                    Deck
                </button>
                <button
                    onClick={() =>
                        setParent(
                            <SettingsModal
                                setParent={setParent}></SettingsModal>
                        )
                    }
                    className="btn">
                    Settings
                </button>
                <button
                    onClick={() => {
                        window.location.reload();
                    }}
                    className="btn">
                    Return to Title
                </button>
            </div>
        </>
    );
};

export default StatusModal;
