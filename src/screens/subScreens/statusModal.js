import React, { useContext, useState } from "react";
import SettingsModal from "./settingsModal";
import { AppContext } from "../../appContext";

const StatusModal = ({ setParent }) => {
    const [context, setContext] = useContext(AppContext);
    const [playerStats, setPlayerStats] = useState(() => {
        let stats = [];
        for (const stat in context.character.stats) {
            stats.push(
                <div>
                    {stat}: {context.character.stats[stat]}
                </div>
            );
        }
        return stats;
    });
    const [inventory, setInventory] = useState(() => {
        let inv = [];
        if (!context.character.inventory) return inv;
        for (const item of context.character.inventory) {
            inv.push(
                <div
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
                    <div className="player-name">{context.character.name}</div>
                    <div className="player-sprite"></div>
                </div>
                <div className="player-stats">{playerStats}</div>
            </div>
            <div className="player-inventory">{inventory}</div>
            <button
                onClick={() =>
                    setParent(
                        <SettingsModal setParent={setParent}></SettingsModal>
                    )
                }
                className="btn">
                Settings
            </button>
        </>
    );
};

export default StatusModal;
