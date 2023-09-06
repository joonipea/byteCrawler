import React, { useContext, useState } from "react";
import { AppContext } from "../appContext";

const LevelUpScreen = ({ setParent }) => {
    const [context, setContext] = useContext(AppContext);
    const [statPoints, setStatPoints] = useState(context.character.level * 2);
    const [currentStats, setCurrentStats] = useState({
        health: context.character.stats.health,
        maxHealth: context.character.stats.maxHealth,
        attack: context.character.stats.attack,
        defense: context.character.stats.defense,
        luck: context.character.stats.luck,
    });

    const increaseStat = (stat) => {
        if (statPoints > 0) {
            setStatPoints(statPoints - 1);
            setCurrentStats((oldStats) => {
                return {
                    ...oldStats,
                    [stat]: oldStats[stat] + 1,
                };
            });
        }
    };

    const decreaseStat = (stat) => {
        if (currentStats[stat] > context.character.stats[stat]) {
            setStatPoints(statPoints + 1);
            setCurrentStats((oldStats) => {
                return {
                    ...oldStats,
                    [stat]: oldStats[stat] - 1,
                };
            });
        }
    };

    const confirm = () => {
        if (statPoints > 0) {
            return;
        }
        setContext((oldContext) => {
            return {
                ...oldContext,
                character: {
                    ...oldContext.character,
                    level: oldContext.character.level + 1,
                    stats: currentStats,
                },
            };
        });
        setParent([]);
    };

    return (
        <div className="level-up--container">
            <p className="level-up--text">Level Up!</p>
            <p className="level-up--text">
                You are now level {context.character.level + 1}
            </p>
            <p className="level-up--text">
                You have {statPoints} stat points to spend
            </p>
            <div className="stat-container">
                <button
                    className="btn"
                    onClick={() => decreaseStat("maxHealth")}>
                    -
                </button>
                <p>Max Health: {currentStats.maxHealth}</p>
                <button
                    className="btn"
                    onClick={() => increaseStat("maxHealth")}>
                    +
                </button>
            </div>
            <div className="stat-container">
                <button className="btn" onClick={() => decreaseStat("attack")}>
                    -
                </button>
                <p>Attack: {currentStats.attack}</p>
                <button className="btn" onClick={() => increaseStat("attack")}>
                    +
                </button>
            </div>
            <div className="stat-container">
                <button className="btn" onClick={() => decreaseStat("defense")}>
                    -
                </button>
                <p>Defense: {currentStats.defense}</p>
                <button className="btn" onClick={() => increaseStat("defense")}>
                    +
                </button>
            </div>
            <div className="stat-container">
                <button className="btn" onClick={() => decreaseStat("luck")}>
                    -
                </button>
                <p>Luck: {currentStats.luck}</p>
                <button className="btn" onClick={() => increaseStat("luck")}>
                    +
                </button>
            </div>
            <button onClick={() => confirm()} className="btn">
                Confirm
            </button>
        </div>
    );
};

export default LevelUpScreen;
