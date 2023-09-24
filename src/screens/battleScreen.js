import React, { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../appContext";

const BattleScreen = ({
    mob,
    setParent,
    cell,
    setScore,
    handleKeys,
    mapMusic,
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
                setMobName(data[0].name);
            });
    }, [mob]);

    // set battle order
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
        setAttackerHealth,
        setAttackerState,
        setAttackerMessage,
        defender,
        defenderState,
        setDefenderHealth,
        setDefenderState,
        setDefenderMessage
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

        const message = `${attackerName} attacks ${defenderName} for ${damage} damage.`;

        const defenceMessage = `${defenderName} defends${
            damage - defender.stats.defense < 0
                ? ", takes a breath, and restores " +
                  Math.min(
                      Math.abs(damage - defender.stats.defense),
                      defender.stats.maxHealth - defender.stats.health
                  ) +
                  " health."
                : " and takes " + (damage - defender.stats.defense) + " damage."
        }`;

        const evadeMessage = `${defenderName} evades the attack.`;

        if (attackerState === "attacking") {
            if (defenderState === "attacking" || defenderState === "neutral") {
                setDefenderHealth(damage);
                setAttackerMessage(message);
            } else if (defenderState === "evading") {
                if (evadeChance > hitChance) {
                    setDefenderHealth(damage);
                    setAttackerMessage(message);
                } else {
                    setAttackerMessage(evadeMessage);
                }
            } else if (defenderState === "defending") {
                setDefenderHealth(damage - defender.stats.defense);
                setAttackerMessage(defenceMessage);
            }
        }
    }

    useEffect(() => {
        if (!mobData.stats || playerState === "neutral") {
            return;
        }
        setPlayerAttack("");
        setMobAttack("");
        setEnemyState("attacking");
        let attacker,
            attackerState,
            setAttackerHealth,
            setAttackerState,
            setAttackerMessage,
            defender,
            defenderState,
            setDefenderHealth,
            setDefenderState,
            setDefenderMessage;
        if (battleOrder() === "enemy") {
            attacker = mobData;
            attackerState = enemyState;
            setAttackerHealth = damageMob;
            setAttackerState = setEnemyState;
            setAttackerMessage = setMobAttack;
            defender = context.character;
            defenderState = playerState;
            setDefenderHealth = setPlayerHealth;
            setDefenderState = setPlayerState;
            setDefenderMessage = setPlayerAttack;
        } else {
            attacker = context.character;
            attackerState = playerState;
            setAttackerHealth = setPlayerHealth;
            setAttackerState = setPlayerState;
            setAttackerMessage = setPlayerAttack;
            defender = mobData;
            defenderState = enemyState;
            setDefenderHealth = damageMob;
            setDefenderState = setEnemyState;
            setDefenderMessage = setMobAttack;
        }
        battleTurn(
            attacker,
            attackerState,
            setAttackerHealth,
            setAttackerState,
            setAttackerMessage,
            defender,
            defenderState,
            setDefenderHealth,
            setDefenderState,
            setDefenderMessage
        );
        battleTurn(
            defender,
            defenderState,
            setDefenderHealth,
            setDefenderState,
            setDefenderMessage,
            attacker,
            attackerState,
            setAttackerHealth,
            setAttackerState,
            setAttackerMessage
        );
        setPlayerState("neutral");
    }, [playerState]);

    function victory() {
        const drops = mobData.drops;
        for (let drop of drops) {
            setScore((oldScore) => oldScore + drop.price);
        }

        cell.classList.remove(mob);
        cell.classList.add("floor");
        stopRef.current.click();
        mapMusic.click();
        document.addEventListener("keydown", handleKeys);
        setParent([]);
    }

    useEffect(() => {
        if (!mobData.stats) return;
        if (context.character.stats.health <= 0) return;
        if (mobHealth <= 0) {
            victory();
        }
    }, [mobHealth]);

    useEffect(() => {
        if (context.character.stats.health <= 0) {
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
        //this is the webaudio loooooppppppp
        //enter url in the next line
        var url = "./music/FIGHT.wav";

        /* --- set up web audio --- */
        //create the context
        audio_context = new AudioContext();

        //...and the source
        var source = audio_context.createBufferSource();
        //connect it to the destination so you can hear it.
        const gainNode = audio_context.createGain();

        gainNode.gain.value = context.volume / 100;
        gainNode.connect(audio_context.destination);
        source.connect(gainNode);

        /* --- load buffer ---  */
        var request = new XMLHttpRequest();
        //open the request
        request.open("GET", url, true);
        //webaudio paramaters
        request.responseType = "arraybuffer";
        //Once the request has completed... do this
        request.onload = function () {
            audio_context.decodeAudioData(
                request.response,
                function (response) {
                    /* --- play the sound AFTER the buffer loaded --- */
                    //set the buffer to the response we just received.
                    source.buffer = response;
                    //start(0) should play asap.
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
        //Now that the request has been defined, actually make the request. (send it)
        request.send();
    }, []);

    return (
        <div id="battle-screen">
            <div ref={stopRef}></div>
            <div className="entity-container">
                <div className="enemy-battler">
                    <div className="enemy-battler-name">{mobName}</div>
                    <div className="enemy-battler-hp">
                        {mobHealth} / {mobMaxHealth}
                    </div>
                    <div className="enemy-sprite"></div>
                </div>
                <div className="player-battler">
                    <div className="player-battler-name">
                        {context.character.name}
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
                            document.addEventListener("keydown", handleKeys);
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
