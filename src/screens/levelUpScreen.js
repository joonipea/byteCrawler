import React, { useContext, useState } from "react";
import { AppContext } from "../appContext";
import Card from "./dialogs/sub dialogs/card";

const LevelUpScreen = ({ setParent, learnedCards }) => {
    const [context, setContext] = useContext(AppContext);
    const [statPoints, setStatPoints] = useState(4);
    const [currentStats, setCurrentStats] = useState({
        health: context.character.stats.health,
        maxHealth: context.character.stats.maxHealth,
        attack: context.character.stats.attack,
        defense: context.character.stats.defense,
        luck: context.character.stats.luck,
        mp: context.character.stats.mp,
        maxMP: context.character.stats.maxMP,
    });
    const [subScreen, setSubScreen] = useState(0);

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
            {subScreen === 0 && (
                <>
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
                        <button
                            className="btn"
                            onClick={() => decreaseStat("maxMP")}>
                            -
                        </button>
                        <p>Max MP: {currentStats.maxMP}</p>
                        <button
                            className="btn"
                            onClick={() => increaseStat("maxMP")}>
                            +
                        </button>
                    </div>
                    <div className="stat-container">
                        <button
                            className="btn"
                            onClick={() => decreaseStat("attack")}>
                            -
                        </button>
                        <p>Attack: {currentStats.attack}</p>
                        <button
                            className="btn"
                            onClick={() => increaseStat("attack")}>
                            +
                        </button>
                    </div>
                    <div className="stat-container">
                        <button
                            className="btn"
                            onClick={() => decreaseStat("defense")}>
                            -
                        </button>
                        <p>Defense: {currentStats.defense}</p>
                        <button
                            className="btn"
                            onClick={() => increaseStat("defense")}>
                            +
                        </button>
                    </div>
                    <div className="stat-container">
                        <button
                            className="btn"
                            onClick={() => decreaseStat("luck")}>
                            -
                        </button>
                        <p>Luck: {currentStats.luck}</p>
                        <button
                            className="btn"
                            onClick={() => increaseStat("luck")}>
                            +
                        </button>
                    </div>
                    {learnedCards.length > 0 ? (
                        <button
                            onClick={() => {
                                if (statPoints > 0) return;
                                setSubScreen(1);
                            }}
                            className="btn">
                            View New Cards
                        </button>
                    ) : (
                        <button onClick={() => confirm()} className="btn">
                            Confirm
                        </button>
                    )}
                </>
            )}
            {subScreen === 1 && (
                <>
                    <p>You Learned:</p>

                    <div className="deck-container">
                        {learnedCards.map((card, index) => {
                            let newCard = card;
                            const cardProfeciencies = newCard.stats;
                            let damage = 0;
                            const stats = currentStats;
                            for (let profeciency of cardProfeciencies) {
                                damage += Math.ceil(
                                    stats[profeciency[0]] * profeciency[1]
                                );
                            }
                            newCard.damage = damage;
                            return (
                                <Card
                                    key={index}
                                    card={newCard}
                                    onClick={() => {}}
                                />
                            );
                        })}
                    </div>
                    <div className="btn-container--horizontal">
                        <button onClick={() => setSubScreen(0)} className="btn">
                            Back
                        </button>
                        <button onClick={() => confirm()} className="btn">
                            Close
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default LevelUpScreen;
