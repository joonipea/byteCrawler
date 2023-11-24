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

    useEffect(() => {
        const mName = mob.split(":")[1];
        if (context.bestiary[mName]) {
            setMobData(context.bestiary[mName]);
            setMobHealth(context.bestiary[mName].stats.health);
            setMobMaxHealth(context.bestiary[mName].stats.maxHealth);
            setMobName(context.bestiary[mName].name.replace(/_/g, " "));
            console.log("cached");
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
                setContext((oldContext) => {
                    return {
                        ...oldContext,
                        bestiary: {
                            ...oldContext.bestiary,
                            [data[0].name]: data[0],
                        },
                    };
                });
                setMobData(data[0]);
                setMobHealth(data[0].stats.health);
                setMobMaxHealth(data[0].stats.maxHealth);
                setMobName(data[0].name.replace(/_/g, " "));
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
        setContext((oldContext) => {
            return {
                ...oldContext,
                character: {
                    ...oldContext.character,
                    stats: {
                        ...oldContext.character.stats,
                        health: newHealth,
                    },
                },
            };
        });
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

        setPlayerAttack(
            `${context.character.name.replace(
                /_/g,
                " "
            )} attacks ${mobName} for ${damage} damage.`
        );
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
        setPlayerAttack(
            `${context.character.name.replace(/_/g, " ")} heals for ${
                damage * -1
            } health.`
        );

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
        setTurn(1);
    }

    function drawCard(card) {
        const numberOfCards = card.cards;
        for (let i = 0; i < numberOfCards; i++) {
            const randomCard = pickCard(context.character.level);
            addToHand(randomCard.key);
        }
        setTurn(1);
    }

    const pickCard = (level) => {
        const cardNames = Object.keys(CARDS);
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

    function attackPlayer(attacker) {
        if (!attacker.stats) return;
        const damage = calcDamage(attacker.stats.luck, attacker.stats.attack);
        setPlayerHealth(damage);
        damageText(playerDamageRef, damage, "red");
        setMobAttack(
            `${attacker.name.replace(
                /_/g,
                " "
            )} attacks ${context.character.name.replace(
                /_/g,
                " "
            )} for ${damage} damage.`
        );
    }

    useEffect(() => {
        if (turn === 1) {
            handRef.current.style.transform = "translateX(100vw)";
            if (mobHealth <= 0) return;
            setTimeout(() => {
                setTurn(0);
                attackPlayer(mobDataRef.current);
                handRef.current.style.transform = "none";
            }, 1000);
        }
    }, [turn]);

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
            context.character.inventory.includes("Cracked Wise Glasses")
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
            `${context.character.name.replace(
                /_/g,
                " "
            )} has defeated ${mobName}! ${context.character.name.replace(
                /_/g,
                " "
            )} gains ${exp} experience.`
        );

        setTimeout(() => {
            cell.classList.remove(mob);
            cell.classList.add("floor");
            stopRef.current.click();
            mapMusic.click();
            bindControls();
            setParent([]);
        }, 2000);
    }

    useEffect(() => {
        if (!mobData.stats) return;
        if (
            context.character.stats.health <= 0 &&
            !(
                context.character.inventory &&
                context.character.inventory.includes("Phoenix Plume")
            )
        )
            return;
        if (mobHealth <= 0) {
            setTimeout(() => {
                victory();
            }, 1000);
        }
    }, [mobHealth]);

    // handle death of character
    function createGhost() {
        const ghost = context.character.id;
        const updatedMaps = context.maps.map((map) => {
            if (map.id === context.map.id) {
                // map is a string[][]
                // find a random floor tile to place one ghost
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
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    character: {
                        ...oldContext.character,
                        inventory: oldContext.character.inventory.filter(
                            (item) => item !== "Phoenix Plume"
                        ),
                        stats: {
                            ...oldContext.character.stats,
                            health: oldContext.character.stats.maxHealth,
                        },
                    },
                };
            });
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
                    };
                });
            }, 1000);
        }
    }, [context.character.stats.health]);

    useEffect(() => {
        mapMusic.click();
        const audio = new Audio();
        let url;
        if (audio.canPlayType("audio/ogg; codecs=vorbis") === "probably") {
            url = "./music/FIGHT_REPRISE.ogg";
        } else {
            url = "./music/FIGHT_REPRISE.wav";
        }

        audio_context = new AudioContext();

        var source = audio_context.createBufferSource();

        const gainNode = audio_context.createGain();

        gainNode.gain.value = context.volume / 100;
        gainNode.connect(audio_context.destination);
        source.connect(gainNode);

        var request = new XMLHttpRequest();

        request.open("GET", url, true);

        request.responseType = "arraybuffer";

        request.onload = function () {
            audio_context.decodeAudioData(
                request.response,
                function (response) {
                    source.buffer = response;

                    source.start(0);
                    source.loop = true;
                },
                function () {
                    console.error("The request failed.");
                }
            );
        };
        stopRef.current.addEventListener("click", () => {
            source.stop();
            audio_context.close();
        });

        request.send();
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
                    <div className="enemy-battler-hp">
                        {mobHealth} / {mobMaxHealth}
                    </div>
                    <div className="enemy-sprite"></div>
                </div>
                <div className="player-battler sprite-container">
                    <div ref={playerDamageRef} className="damage-message"></div>
                    <div className="player-battler-name">
                        {context.character.name.replace(/_/g, " ")}
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
        </div>
    );
};

export default BattleScreen;
