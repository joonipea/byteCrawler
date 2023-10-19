import React, { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../appContext";

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
    const [playerState, setPlayerState] = useState("neutral");
    const [enemyState, setEnemyState] = useState("attacking");
    const [mobAttack, setMobAttack] = useState("");
    const [playerAttack, setPlayerAttack] = useState("");
    const stopRef = useRef();
    const playerDamageRef = useRef();
    const mobDamageRef = useRef();
    var audio_context;

    useEffect(() => {
        fetch(process.env.REACT_APP_MIDDLEWARE_URL + "/get", {
            method: "GET",
            headers: {
                record: mob,
                user: context.worldName,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setMobData(data[0]);
                setMobHealth(data[0].stats.health);
                setMobMaxHealth(data[0].stats.maxHealth);
                setMobName(data[0].name.replace(/_/g, " "));
            });
    }, [mob]);

    function battleOrder() {
        const enemyRoll =
            Math.floor(Math.random() * 20) +
            Math.floor(Math.random() * mobData.stats.luck);
        const playerRoll =
            Math.floor(Math.random() * 20) +
            Math.floor(Math.random() * context.character.stats.luck);
        if (enemyRoll > playerRoll) {
            return "enemy";
        }
        return "player";
    }

    function setPlayerHealth(damage) {
        let newHealth;
        if (damage < 0) {
            newHealth = Math.min(
                context.character.stats.health - damage,
                context.character.stats.maxHealth
            );
        } else {
            newHealth = Math.max(context.character.stats.health - damage, 0);
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

    function damageMob(damage) {
        setMobHealth((oldHealth) => oldHealth - damage);
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

    // battle logic
    function battleTurn(
        attacker,
        attackerState,
        setAttackerMessage,
        defender,
        defenderState,
        setDefenderHealth,
        defenderDamageRef
    ) {
        const hitChance = Math.floor(Math.random() * 20) + 1;
        const evadeChance =
            Math.floor(Math.random() * 20) + 1 + defender.stats.luck;
        const damage = calcDamage(attacker.stats.luck, attacker.stats.attack);

        const attackerName = `<span style="color: ${
            attacker.name === context.character.name ? "white" : "red"
        }">${attacker.name}</span>`;

        const defenderName = `<span style="color: ${
            defender.name === context.character.name ? "white" : "red"
        }">${defender.name}</span>`;

        const message = `${attackerName.replace(
            /_/g,
            " "
        )} attacks ${defenderName.replace(/_/g, " ")} for ${damage} damage.`;

        const defenceMessage = `${defenderName.replace(/_/g, " ")} defends${
            damage - defender.stats.defense < 0
                ? ", takes a breath, and restores " +
                  Math.min(
                      Math.abs(damage - defender.stats.defense),
                      defender.stats.maxHealth - defender.stats.health
                  ) +
                  " health."
                : " and takes " + (damage - defender.stats.defense) + " damage."
        }`;

        const evadeMessage = `${defenderName.replace(
            /_/g,
            " "
        )} evades the attack.`;

        if (attackerState === "attacking") {
            if (defenderState === "attacking" || defenderState === "neutral") {
                setDefenderHealth(damage);
                setAttackerMessage(message);
                defenderDamageRef.innerText = `-${damage}`;
                defenderDamageRef.style.color = "red";
            } else if (defenderState === "evading") {
                if (evadeChance > hitChance) {
                    setDefenderHealth(damage);
                    setAttackerMessage(message);
                    defenderDamageRef.innerText = `-${damage}`;
                    defenderDamageRef.style.color = "red";
                } else {
                    setAttackerMessage(evadeMessage);
                    defenderDamageRef.innerText = "Miss";
                    defenderDamageRef.style.color = "white";
                }
            } else if (defenderState === "defending") {
                setDefenderHealth(damage - defender.stats.defense);
                setAttackerMessage(defenceMessage);
                defenderDamageRef.innerText =
                    damage - defender.stats.defense > 0
                        ? `-${damage - defender.stats.defense}`
                        : `+${Math.abs(damage - defender.stats.defense)}`;
                defenderDamageRef.style.color =
                    damage - defender.stats.defense > 0 ? "red" : "#7bff7b";
            }

            if (defender.stats.health <= 0) {
                if (defender.name === context.character.name) {
                    setAttackerMessage(
                        `${attackerName.replace(/_/g, " ")} has been defeated.`
                    );
                }
            }
            defenderDamageRef.style.opacity = 1;
            defenderDamageRef.style.animation = "floatAway 1s ease-in-out 1";
            setTimeout(() => {
                defenderDamageRef.style.animation = "";
                defenderDamageRef.style.opacity = 0;
            }, 1000);
        }
    }

    useEffect(() => {
        if (!mobData.stats || playerState === "neutral") {
            return;
        }
        lockOptions();
        setPlayerAttack("");
        setMobAttack("");
        setEnemyState("attacking");
        let attacker,
            attackerState,
            setAttackerHealth,
            setAttackerState,
            setAttackerMessage,
            attackerDamageRef,
            defender,
            defenderState,
            setDefenderHealth,
            setDefenderState,
            setDefenderMessage,
            defenderDamageRef;
        if (battleOrder() === "enemy") {
            attacker = mobData;
            attackerState = enemyState;
            setAttackerHealth = damageMob;
            setAttackerState = setEnemyState;
            setAttackerMessage = setMobAttack;
            attackerDamageRef = mobDamageRef.current;
            defender = context.character;
            defenderState = playerState;
            setDefenderHealth = setPlayerHealth;
            setDefenderState = setPlayerState;
            setDefenderMessage = setPlayerAttack;
            defenderDamageRef = playerDamageRef.current;
        } else {
            attacker = context.character;
            attackerState = playerState;
            setAttackerHealth = setPlayerHealth;
            setAttackerState = setPlayerState;
            setAttackerMessage = setPlayerAttack;
            attackerDamageRef = playerDamageRef.current;
            defender = mobData;
            defenderState = enemyState;
            setDefenderHealth = damageMob;
            setDefenderState = setEnemyState;
            setDefenderMessage = setMobAttack;
            defenderDamageRef = mobDamageRef.current;
        }
        battleTurn(
            attacker,
            attackerState,
            setAttackerMessage,
            defender,
            defenderState,
            setDefenderHealth,
            defenderDamageRef
        );
        battleTurn(
            defender,
            defenderState,
            setDefenderMessage,
            attacker,
            attackerState,
            setAttackerHealth,
            attackerDamageRef
        );
        setTimeout(() => {
            setPlayerState("neutral");
            unlockOptions();
        }, 1000);
    }, [playerState]);

    function lockOptions() {
        document.querySelectorAll(".btn").forEach((btn) => {
            btn.disabled = true;
        });
    }

    function unlockOptions() {
        document.querySelectorAll(".btn").forEach((btn) => {
            btn.disabled = false;
        });
    }

    function victory() {
        lockOptions();
        const enemyDiv = document.querySelector(".enemy-battler");
        let drops = [];
        if (ghost) {
            console.log(mobData);
            let ghostRarity = 0;
            for (let stat of Object.values(mobData.stats)) {
                ghostRarity += stat;
            }
            for (let i = 0; i < ghostRarity; i++) {
                drops.push({
                    name: "Ghost Essence",
                    price: 100,
                });
            }
        } else {
            drops = mobData.drops;
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
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    screen: "gameover",
                };
            });
        }
    }, [context.character.stats.health]);

    useEffect(() => {
        mapMusic.click();

        var url = "./music/FIGHT_REPRISE.ogg";

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
        green: "136deg",
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
            <div className="battle-options">
                <button
                    onClick={() => setPlayerState("attacking")}
                    className="btn">
                    Attack
                </button>
                <button
                    onClick={() => setPlayerState("defending")}
                    className="btn">
                    Defend
                </button>
                <button
                    onClick={() => setPlayerState("evading")}
                    className="btn">
                    Evade
                </button>
                <button
                    onClick={() => {
                        const runChance = Math.random();
                        if (runChance > 0.5) {
                            bindControls();
                            stopRef.current.click();
                            mapMusic.click();
                            setParent([]);
                        } else {
                            setPlayerState("evading");
                        }
                    }}
                    className="btn">
                    Run
                </button>
            </div>
        </div>
    );
};

export default BattleScreen;
