import React, {
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";
import { AppContext } from "../appContext";
import Hand from "./dialogs/hand";
import CARDS from "../assets/cards.json";
import { cacheMob } from "../hooks/cache";
import { changeStat, removeItem } from "../hooks/stats";

const BattleScreen = ({
    mob,
    setParent,
    cell,
    setScore,
    handleKeys,
    bindControls,
    mapMusic,
    ghost,
}) => {
    const [context, setContext] = useContext(AppContext);
    const [mobData, setMobData] = useState({});
    const [mobHealth, setMobHealth] = useState(0);
    const [mobMaxHealth, setMobMaxHealth] = useState(0);
    const [mobName, setMobName] = useState("");
    const [turn, setTurn] = useState(0); // 0 = player, 1 = mob
    const [mobAttack, setMobAttack] = useState("");
    const [playerAttack, setPlayerAttack] = useState("");
    const stopRef = useRef();
    const contextRef = useRef();
    const playerDamageRef = useRef();
    const mobDamageRef = useRef();
    const mobDataRef = useRef();
    const handRef = useRef();
    contextRef.current = context;
    mobDataRef.current = mobData;
    var audio_context;
    const charName = context.character.name.replace(/_/g, " ");

    function getAvailableCards() {
        if (contextRef.current.deck && contextRef.current.deck.length > 0) {
            return contextRef.current.deck;
        }
        const cards = Object.values(CARDS);
        return cards.filter((card) => card.level <= context.character.level);
    }

    useEffect(() => {
        const mName = mob.split(":")[1];
        if (context.bestiary[mName]) {
            setMobData(context.bestiary[mName]);
            setMobHealth(context.bestiary[mName].stats.health);
            setMobMaxHealth(context.bestiary[mName].stats.maxHealth);
            setMobName(context.bestiary[mName].name.replace(/_/g, " "));
            return;
        }
        fetch(process.env.REACT_APP_MIDDLEWARE_URL + "/get", {
            method: "GET",
            headers: {
                record: mob,
                user: context.worldName,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                cacheMob(setContext, data);
                setMobData(data);
                setMobHealth(data.stats.health);
                setMobMaxHealth(data.stats.maxHealth);
                setMobName(data.name.replace(/_/g, " "));
            });
    }, [mob]);

    function setPlayerHealth(damage) {
        let newHealth;

        if (damage < 0) {
            newHealth = Math.min(
                contextRef.current.character.stats.health - damage,
                contextRef.current.character.stats.maxHealth
            );
        } else {
            newHealth = Math.max(
                contextRef.current.character.stats.health - damage,
                0
            );
        }
        changeStat(setContext, "health", newHealth);
    }

    function calcDamage(luck, attack) {
        const damage = Math.floor(
            Math.random() * (attack - (attack + luck) / 2) + (attack + luck) / 2
        );
        const critChance = Math.floor(Math.random() * 20) + 1 + luck / 20;
        const secondHit = Math.floor(Math.random() * luck) + 1;
        if (critChance > 19) {
            return damage + secondHit;
        } else {
            return damage;
        }
    }
    /* card actions */
    function handleCards(card) {
        switch (card.target) {
            case "enemy":
                attackCard(card);
                break;
            case "self":
                selfCard(card);
                break;
            default:
                break;
        }
    }

    function attackCard(card) {
        const damage = card.damage;
        setMobHealth((oldHealth) => oldHealth - damage);

        setPlayerAttack(`${charName} attacks ${mobName} for ${damage} damage.`);
        damageText(mobDamageRef, damage, "red");
        setTurn(1);
    }

    function selfCard(card) {
        switch (card.type) {
            case "spell":
                healCard(card);
                break;
            case "item":
                itemCard(card);
                break;
            case "draw":
                drawCard(card);
                break;
            default:
                break;
        }
    }

    function healCard(card) {
        const damage = card.damage * -1;
        setPlayerAttack(`${charName} heals for ${damage * -1} health.`);
        damageText(playerDamageRef, damage, "#7bff7b");
        setPlayerHealth(damage);
        setTurn(1);
    }

    function itemCard(card) {
        const damage = card.damage;
        const cards = card.cards;
        for (let i = 0; i < damage; i++) {
            for (let newCard of cards) {
                addToHand(newCard);
            }
        }
    }

    function drawCard(card) {
        const numberOfCards = card.cards;
        for (let i = 0; i < numberOfCards; i++) {
            const randomCard = pickCard(context.character.level);
            addToHand(randomCard.key);
        }
    }

    const pickCard = (level) => {
        const availableCards = getAvailableCards();
        const cardNames = availableCards.map((card) => card.key);
        const randomCard =
            CARDS[cardNames[Math.floor(Math.random() * cardNames.length)]];
        if (randomCard.level <= level) return randomCard;
        return pickCard(level);
    };

    function resetHand() {
        for (let i = 0; i < 5; i++) {
            let randomCard = pickCard(context.character.level);
            addToHand(randomCard.key);
        }
    }

    function addToHand(card) {
        if (!context.newCards) {
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    newCards: [card],
                };
            });
            return;
        }
        setContext((oldContext) => {
            return {
                ...oldContext,
                newCards: [...oldContext.newCards, card],
            };
        });
        return;
    }

    /* end card actions */

    function meditate() {
        const medAmt = Math.floor(
            context.character.stats.maxMP * 0.5 +
                context.character.stats.luck * 0.5
        );
        const restored = Math.min(
            context.character.stats.mp + medAmt,
            context.character.stats.maxMP
        );
        const display = restored - context.character.stats.mp;
        setPlayerAttack(`${charName} meditates for ${display} MP.`);

        damageText(playerDamageRef, display, "#0060fb");
        setTurn(1);
        changeStat(setContext, "mp", restored);
    }
    function attackPlayer(attacker) {
        if (!attacker.stats) return;
        const damage = calcDamage(attacker.stats.luck, attacker.stats.attack);
        setPlayerHealth(damage);
        damageText(playerDamageRef, damage, "red");
        setMobAttack(
            `${attacker.name.replace(
                /_/g,
                " "
            )} attacks ${charName} for ${damage} damage.`
        );
        if (contextRef.current.character.stats.health - damage <= 0) return;
        setTurn(0);
        handRef.current.style.transform = "none";
    }

    useEffect(() => {
        if (turn === 0) return;
        handRef.current.style.transform = "translateX(100vw)";
        if (mobHealth <= 0) return;
        setTimeout(() => {
            attackPlayer(mobDataRef.current);
        }, 1000);
    }, [turn]);

    useEffect(() => {
        if (!mobData.stats) {
            handRef.current.style.transform = "translateX(100vw)";
            return;
        }
        if (turn === 0) {
            handRef.current.style.transform = "none";
        }
    }, [mobData.stats]);

    function damageText(ref, damage, color) {
        ref.current.innerText = damage * -1;
        ref.current.style.opacity = 1;
        ref.current.style.color = color;
        ref.current.style.animation = "floatAway 1s ease-in-out 1";
        setTimeout(() => {
            ref.current.style.opacity = 0;
            ref.current.style.animation = "";
        }, 1000);
    }

    function flee() {
        const success =
            Math.random() + context.character.stats.luck / 200 > 0.5;
        if (!success) {
            setPlayerAttack(`${charName} couldn't get away!`);
            setTurn(1);
            return;
        }
        setPlayerAttack(`${charName} got away safely!`);
        setTimeout(() => {
            cell.classList.remove(mob);
            cell.classList.add("floor");
            bindControls();
            setParent([]);
            changeStat(setContext, "mp", context.character.stats.maxMP);
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    url: "./music/map.wav",
                };
            });
        }, 1000);
        return;
    }

    function victory() {
        const enemyDiv = document.querySelector(".enemy-battler");
        let drops = [];

        let ghostRarity = 0;
        for (let stat of Object.values(mobData.stats)) {
            ghostRarity += stat;
        }
        for (let i = 0; i < ghostRarity; i++) {
            drops.push({
                name: "Ghost Essence",
                price: 10,
            });
        }

        const expMultiplier =
            context.character.inventory &&
            context.character.inventory.includes("Wise Glasses")
                ? 1.5
                : 1;
        let exp = 0;
        for (let drop of drops) {
            exp += Math.ceil(drop.price * expMultiplier);
            setScore(
                (oldScore) => oldScore + Math.ceil(drop.price * expMultiplier)
            );
        }

        enemyDiv.style.animation = "floatAway 0.5s ease-in-out 1";
        enemyDiv.style.opacity = 0;
        setMobAttack("");
        setPlayerAttack(
            `${charName} has defeated ${mobName}! ${charName} gains ${exp} experience.`
        );

        setTimeout(() => {
            cell.classList.remove(mob);
            cell.classList.add("floor");
            bindControls();
            setParent([]);
            changeStat(setContext, "mp", context.character.stats.maxMP);
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    url: "./music/map.wav",
                };
            });
        }, 2000);
    }

    useEffect(() => {
        if (!mobData.stats) return;
        const inventory = context.character.inventory;
        if (
            context.character.stats.health <= 0 &&
            !(inventory && inventory.includes("Phoenix Plume"))
        )
            return;
        if (mobHealth <= 0)
            setTimeout(() => {
                victory();
            }, 1000);
    }, [mobHealth]);

    // handle death of character
    function createGhost() {
        const ghost = context.character.id;
        const updatedMaps = context.maps.map((map) => {
            if (map.id === context.map.id) {
                let x, y;
                do {
                    x = Math.floor(Math.random() * map.map.length);
                    y = Math.floor(Math.random() * map.map[0].length);
                } while (map.map[x][y] !== "floor");
                map.map[x][y] = ghost;
            }
            return map;
        });
        setContext((oldContext) => {
            return {
                ...oldContext,
                maps: updatedMaps,
            };
        });
    }
    useEffect(() => {
        if (
            context.character.stats.health <= 0 &&
            context.character.inventory &&
            context.character.inventory.includes("Phoenix Plume")
        ) {
            removeItem(setContext, "Phoenix Plume");
            changeStat(setContext, "health", context.character.stats.maxHealth);
            return;
        }
        if (context.character.stats.health <= 0) {
            createGhost();
            stopRef.current.click();
            setTimeout(() => {
                setContext((oldContext) => {
                    return {
                        ...oldContext,
                        screen: "gameover",
                        stopMusic: true,
                    };
                });
            }, 1000);
        }
    }, [context.character.stats.health]);

    useEffect(() => {
        const audio = new Audio();
        let url;
        if (audio.canPlayType("audio/ogg; codecs=vorbis") === "probably") {
            url = "./music/FIGHT_REPRISE.ogg";
        } else {
            url = "./music/FIGHT_REPRISE.wav";
        }
        setContext((oldContext) => {
            return {
                ...oldContext,
                url: url,
            };
        });
    }, []);

    const colors = {
        green: "136deg) brightness(3",
        red: "0deg",
        blue: "240deg",
        yellow: "60deg) brightness(3",
        deadly: "0deg",
        sad: "240deg",
        happy: "60deg) brightness(3",
    };

    return (
        <div id="battle-screen">
            <style>
                {ghost
                    ? `
                .enemy-sprite {
                    background-image: url("./sprites/ghost.png");
                }
                `
                    : `
                .enemy-sprite {
                    background-image: url("./sprites/${
                        mobName.split(/\s(.*)/s)[1]
                    }.png");
                    filter: brightness(0.1) brightness(50%) sepia(100%) saturate(10000%)
                    hue-rotate(${colors[mobName.split(" ")[0]]});
                }
                `}
            </style>
            <div ref={stopRef}></div>
            <div className="entity-container">
                <div className="enemy-battler sprite-container">
                    <div ref={mobDamageRef} className="damage-message"></div>
                    <div className="enemy-battler-name">{mobName}</div>
                    <div className="enemy-battler-hp-bar">
                        <div
                            className="enemy-battler-hp-bar--inner"
                            style={{
                                width: `${Math.max(
                                    (mobHealth / mobMaxHealth) * 100,
                                    0
                                )}%`,
                            }}></div>
                    </div>
                    <div className="enemy-battler-hp">
                        {mobHealth} / {mobMaxHealth}
                    </div>
                    <div className="enemy-sprite"></div>
                </div>
                <div className="player-battler sprite-container">
                    <div ref={playerDamageRef} className="damage-message"></div>
                    <div className="player-battler-name">{charName}</div>
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
                        {context.character.stats.health} /{" "}
                        {context.character.stats.maxHealth}
                    </div>

                    <div className="player-sprite"></div>
                </div>
            </div>
            <div className="battle-log">
                <div
                    dangerouslySetInnerHTML={{ __html: mobAttack }}
                    className="battle-log-entry"></div>
                <div
                    dangerouslySetInnerHTML={{ __html: playerAttack }}
                    className="battle-log-entry"></div>
            </div>
            <Hand
                ref={handRef}
                handleCards={handleCards}
                stats={context.character.stats}
                level={context.character.level}
            />
            <div className="battle-options">
                <button className="btn" onClick={() => flee()}>
                    Flee
                </button>

                <button className="btn" onClick={() => meditate()}>
                    Meditate
                </button>
            </div>

            <div className="player-battler-mp-bar">
                <div
                    className="player-battler-mp-bar--inner"
                    style={{
                        width: `${
                            (context.character.stats.mp /
                                context.character.stats.maxMP) *
                            100
                        }%`,
                    }}></div>
            </div>
            <div className="player-battler-hp">
                {context.character.stats.mp} / {context.character.stats.maxMP}
            </div>
        </div>
    );
};

export default BattleScreen;
