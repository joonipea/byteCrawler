import React, {
    useContext,
    useEffect,
    useRef,
    useCallback,
    useState,
} from "react";
import { AppContext } from "../appContext";
import BattleScreen from "./battleScreen";
import LevelUpScreen from "./levelUpScreen";
import LoadingScreen from "./loadingScreen";
import DialogScreen from "./dialogScreen";
import PauseScreen from "./pauseScreen";
import CARDS from "../assets/cards.json";

const MapScreen = () => {
    const [context, setContext] = useContext(AppContext);
    const [nextFloor, setNextFloor] = useState({});
    const [loadingScreen, setLoadingScreen] = useState([]);
    const [battleScreen, setBattleScreen] = useState([]);
    const [levelUpScreen, setLevelUpScreen] = useState([]);
    const [dialogScreen, setDialogScreen] = useState([]);
    const mapRef = useRef(null);
    const [tick, setTick] = useState(0);
    const [score, setScore] = useState(context.score ? context.score : 0);
    const [gold, setGold] = useState(context.gold ? context.gold : 0);
    const contextRef = useRef(null);
    const stopRef = useRef(null);
    contextRef.current = context;
    var audio_context;

    function getAvailableCards() {
        if (contextRef.current.deck && contextRef.current.deck.length > 0) {
            return contextRef.current.deck;
        }
        const cards = Object.values(CARDS);
        return cards.filter((card) => card.level <= context.character.level);
    }

    function createMap(data) {
        const container = document.getElementById("map");
        for (const row of data) {
            const rowDiv = document.createElement("div");
            rowDiv.className = "row";

            for (const cellData of row) {
                const cellDiv = document.createElement("div");
                cellDiv.className = `cell ${cellData}`;
                if (cellData === "spawn") {
                    cellDiv.classList.add("player");
                }
                rowDiv.appendChild(cellDiv);
            }

            container.appendChild(rowDiv);
        }
        bindControls();
    }
    //bind arrowkeys to movement
    const handleKeys = useCallback((e) => {
        switch (e.key) {
            case "ArrowUp":
                movePlayer("up");
                break;
            case "ArrowDown":
                movePlayer("down");
                break;
            case "ArrowLeft":
                movePlayer("left");
                break;
            case "ArrowRight":
                movePlayer("right");
                break;
            case "Escape":
                unBindControls();
                setDialogScreen(
                    <PauseScreen
                        bindControls={bindControls}
                        setParent={setDialogScreen}></PauseScreen>
                );
            default:
                break;
        }
    }, []);

    let touchstartX = 0;
    let touchendX = 0;
    let touchstartY = 0;
    let touchendY = 0;
    const handleTouchStart = useCallback((e) => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    }, []);
    const handleTouchEnd = useCallback((e) => {
        touchendX = e.changedTouches[0].screenX;
        touchendY = e.changedTouches[0].screenY;
        checkDirection();
    }, []);

    function checkDirection() {
        let xDiff = touchendX - touchstartX;
        let yDiff = touchendY - touchstartY;
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (touchendX < touchstartX) {
                movePlayer("left");
            }
            if (touchendX > touchstartX) {
                movePlayer("right");
            }
        } else {
            if (touchendY < touchstartY) {
                movePlayer("up");
            }
            if (touchendY > touchstartY) {
                movePlayer("down");
            }
        }
    }

    function movePlayer(direction) {
        const player = document.querySelector(".player");
        const playerParent = player.parentElement;
        const playerIndex = Array.from(playerParent.children).indexOf(player);
        const isMob = (cell) =>
            Array.from(cell.classList).some((c) => c.startsWith("mobs"));
        const isItem = (cell) =>
            Array.from(cell.classList).some((c) => c.startsWith("items"));
        const isTomb = (cell) =>
            Array.from(cell.classList).some((c) => c.startsWith("chars"));
        let nextCell;
        if (direction === "up") {
            nextCell = playerParent.previousElementSibling
                ? playerParent.previousElementSibling.children[playerIndex]
                : undefined;
        }
        if (direction === "down") {
            nextCell = playerParent.nextElementSibling
                ? playerParent.nextElementSibling.children[playerIndex]
                : undefined;
        }
        if (direction === "left") {
            nextCell = player.previousElementSibling;
        }
        if (direction === "right") {
            nextCell = player.nextElementSibling;
        }
        if (!nextCell) return;
        if (nextCell.classList.contains("exit")) {
            unBindControls();
            setLoadingScreen(<LoadingScreen></LoadingScreen>);
            nextMap();
            resetHand();
        }
        if (isTomb(nextCell)) {
            unBindControls();
            const charClass = nextCell.classList[1];
            setDialogScreen(
                <DialogScreen
                    type={"ghost"}
                    setParent={setDialogScreen}
                    bindControls={bindControls}
                    setBattleScreen={() =>
                        setBattleScreen(
                            <BattleScreen
                                setParent={setBattleScreen}
                                mob={charClass}
                                ghost={true}
                                cell={nextCell}
                                setScore={setScore}
                                bindControls={bindControls}
                                mapMusic={stopRef.current}
                            />
                        )
                    }></DialogScreen>
            );
        }
        if (isMob(nextCell)) {
            unBindControls();
            const mobs = Array.from(nextCell.classList).filter((c) =>
                c.startsWith("mobs")
            );
            const mobClass = mobs[0];
            setBattleScreen(
                <BattleScreen
                    setParent={setBattleScreen}
                    mob={mobClass}
                    cell={nextCell}
                    setScore={setScore}
                    bindControls={bindControls}
                    mapMusic={stopRef.current}
                />
            );
        }
        if (isItem(nextCell)) {
            const iName = nextCell.classList[1].split(":")[1];
            if (context.codex[iName]) {
                setGold((oldGold) => oldGold + context.codex[iName].price);
                nextCell.classList.remove(nextCell.classList[1]);
                nextCell.classList.add("open-chest");
            } else {
                getItemPrice(context.worldName, nextCell.classList[1]).then(
                    (item) => {
                        setContext((oldContext) => {
                            return {
                                ...oldContext,
                                codex: {
                                    ...oldContext.codex,
                                    [item.id]: item,
                                },
                            };
                        });
                        setGold((oldGold) => oldGold + item.price);
                        nextCell.classList.remove(nextCell.classList[1]);
                        nextCell.classList.add("open-chest");
                    }
                );
            }
        }
        if (nextCell.classList.contains("well")) {
            //heal the player
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    character: {
                        ...oldContext.character,
                        stats: {
                            ...oldContext.character.stats,
                            health: oldContext.character.stats.maxHealth,
                        },
                    },
                };
            });
        }

        if (nextCell.classList.contains("dungeon")) {
            //put the player in the first floor of the dungeon
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    map: oldContext.maps[0],
                };
            });
        }
        if (nextCell.classList.contains("monolith")) {
            unBindControls();
            setDialogScreen(
                <DialogScreen
                    type={"monolith"}
                    bindControls={bindControls}
                    setParent={setDialogScreen}></DialogScreen>
            );
        }
        if (nextCell.classList.contains("temple")) {
            unBindControls();
            setDialogScreen(
                <DialogScreen
                    type={"temple"}
                    setScore={setScore}
                    bindControls={bindControls}
                    setParent={setDialogScreen}></DialogScreen>
            );
        }
        if (nextCell.classList.contains("merchant")) {
            unBindControls();
            setDialogScreen(
                <DialogScreen
                    type={"merchant"}
                    bindControls={bindControls}
                    setParent={setDialogScreen}></DialogScreen>
            );
        }
        if (nextCell.classList.contains("save")) {
            saveGame();
        }
        if (!nextCell.classList.contains("wall")) {
            player.classList.remove("player");
            nextCell.classList.add("player");
            setTick((oldTick) => oldTick + 1);
        }
    }
    function bindControls() {
        document.addEventListener("keydown", handleKeys);
        document.addEventListener("touchstart", handleTouchStart);
        document.addEventListener("touchend", handleTouchEnd);
    }

    function unBindControls() {
        document.removeEventListener("keydown", handleKeys);
        document.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("touchend", handleTouchEnd);
    }

    function spotlight(map, player) {
        const contextCopy = contextRef.current;
        const mapBounds = map.getBoundingClientRect();
        const playerBounds = player.getBoundingClientRect();
        const playerCenter = {
            x: playerBounds.x - mapBounds.x + playerBounds.width / 2,
            y: playerBounds.y - mapBounds.y + playerBounds.height / 2,
        };
        const circleRadius =
            contextCopy.character.inventory &&
            contextCopy.character.inventory.includes("Oil Lamp")
                ? 5
                : 3;
        map.style.clipPath = `circle(calc(75 / 21 * ${circleRadius}lvmin - 2px) at ${
            playerCenter.x / 1.5
        }px ${playerCenter.y / 1.5}px)`;
        map.style.transformOrigin = `${playerCenter.x / 1.5}px ${
            playerCenter.y / 1.5
        }px`;
    }

    const nextMap = useCallback(() => {
        let contextCopy = contextRef.current;
        if (!contextCopy.maps[contextCopy.map.floor]) {
            generateMap(contextCopy.worldName, contextCopy.map.floor)
                .then((res) => res.json())
                .then((newFloor) => {
                    setNextFloor(newFloor[0]);
                    setLoadingScreen([]);
                    bindControls();
                });
        } else {
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    map: oldContext.maps[oldContext.map.floor],
                };
            });
            setLoadingScreen([]);
            bindControls();
        }
    }, []);

    async function generateMap(name, floor) {
        return fetch(process.env.REACT_APP_MIDDLEWARE_URL + "/generateMap", {
            method: "GET",
            headers: {
                user: name,
                floor: floor,
            },
        });
    }

    //save the game using up to date context
    const saveGame = useCallback(() => {
        let contextCopy = contextRef.current;
        localStorage.setItem("saveData", JSON.stringify(contextCopy));
    }, [context]);

    function moveEnemies(enemy) {
        const enemyClass =
            enemy.classList[enemy.classList.length - 1] != "player"
                ? enemy.classList[enemy.classList.length - 1]
                : enemy.classList[enemy.classList.length - 2];
        const enemyParent = enemy.parentElement;
        const enemyParentIndex = Array.from(
            enemyParent.parentElement.children
        ).indexOf(enemyParent);
        const enemyIndex = Array.from(enemyParent.children).indexOf(enemy);

        const player = document.querySelector(".player");
        const playerParent = player.parentElement;
        const playerParentIndex = Array.from(
            playerParent.parentElement.children
        ).indexOf(playerParent);
        const playerIndex = Array.from(playerParent.children).indexOf(player);

        if (
            Math.abs(enemyParentIndex - playerParentIndex) > 3 ||
            Math.abs(enemyIndex - playerIndex) > 3
        ) {
            return;
        }

        let nextCell;
        if (enemyIndex < playerIndex) {
            nextCell = enemy.nextElementSibling;
            if (
                nextCell.classList.length !== 2 ||
                nextCell.classList.contains("wall")
            ) {
                nextCell = undefined;
            }
        }
        if (!nextCell && enemyIndex > playerIndex) {
            nextCell = enemy.previousElementSibling;
            if (
                nextCell.classList.length !== 2 ||
                nextCell.classList.contains("wall")
            ) {
                nextCell = undefined;
            }
        }
        if (!nextCell && enemyParentIndex > playerParentIndex) {
            nextCell = enemyParent.previousElementSibling.children[enemyIndex];
            if (
                nextCell.classList.length !== 2 ||
                nextCell.classList.contains("wall")
            ) {
                nextCell = undefined;
            }
        }
        if (!nextCell && enemyParentIndex < playerParentIndex) {
            nextCell = enemyParent.nextElementSibling.children[enemyIndex];
            if (
                nextCell.classList.length !== 2 ||
                nextCell.classList.contains("wall")
            ) {
                nextCell = undefined;
            }
        }
        if (nextCell) {
            enemy.classList.remove(enemyClass);
            if (enemy.classList.length === 1) {
                enemy.classList.add("floor");
            }
            nextCell.classList.add(enemyClass);
        }
    }

    useEffect(() => {
        const map = document.getElementById("map");
        const player = document.querySelector(".player");
        const enemies = document.querySelectorAll("[class*= mobs]");
        for (const enemy of enemies) {
            moveEnemies(enemy);
        }
        if (map && player) {
            spotlight(map, player);
        }
    }, [tick]);

    function pickCard(level) {
        const availableCards = getAvailableCards();
        const cardNames = availableCards.map((card) => card.key);
        console.log(cardNames);
        const randomCard =
            CARDS[cardNames[Math.floor(Math.random() * cardNames.length)]];
        if (randomCard.level <= level) return randomCard;
        return pickCard(level);
    }

    function resetHand() {
        const contextCopy = contextRef.current;
        const cardsNeeded = 5 - contextCopy.hand.length;
        for (let i = 0; i < cardsNeeded; i++) {
            const randomCard = pickCard(contextRef.current.character.level);
            const stats = context.character.stats;
            const cardProfeciencies = randomCard.stats;
            let damage = 0;
            for (let profeciency of cardProfeciencies) {
                damage += Math.ceil(stats[profeciency[0]] * profeciency[1]);
            }
            randomCard.damage = damage;
            addToHand(randomCard);
        }
    }

    function addToHand(card) {
        const contextCopy = contextRef.current;
        if (!contextCopy.hand) {
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    hand: [card],
                };
            });
            return;
        }
        setContext((oldContext) => {
            return {
                ...oldContext,
                hand: [...oldContext.hand, card],
            };
        });
        return;
    }

    useEffect(() => {
        if (score <= 0) return;

        setContext((oldContext) => {
            return {
                ...oldContext,
                score: score,
            };
        });

        if (
            score >=
            context.character.level ** 1.6 * context.character.rarity * 500
        ) {
            const level = context.character.level + 1;
            const learnedCards = Object.values(CARDS).filter(
                (c) => c.level == level
            );
            setLevelUpScreen(
                <LevelUpScreen
                    learnedCards={learnedCards}
                    setParent={setLevelUpScreen}></LevelUpScreen>
            );
            resetHand();
        }
    }, [score]);

    useEffect(() => {
        if (gold <= 0) return;

        setContext((oldContext) => {
            return {
                ...oldContext,
                gold: gold,
            };
        });
    }, [gold]);

    useEffect(() => {
        if (!context.map.map) return;

        mapRef.current.innerHTML = "";
        unBindControls();
        createMap(context.map.map);
        spotlight(
            document.getElementById("map"),
            document.querySelector(".player")
        );
    }, [context.map.map]);

    useEffect(() => {
        if (!nextFloor.map) return;
        setContext((oldContext) => {
            return {
                ...oldContext,
                maps: [...oldContext.maps, nextFloor],
                map: nextFloor,
            };
        });
    }, [nextFloor]);

    useEffect(() => {
        //this is the webaudio loooooppppppp
        //enter url in the next line
        var url = "./music/map.wav";

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
            if (audio_context.state === "suspended") {
                audio_context.resume();
            } else {
                audio_context.suspend();
            }
        });
        //Now that the request has been defined, actually make the request. (send it)
        request.send();
    }, []);

    const innerExpBar = () => {
        const expNeeded = Math.floor(
            context.character.level ** 1.6 * context.character.rarity * 500
        );
        const lastExpNeeded = Math.floor(
            (context.character.level - 1) ** 1.6 *
                context.character.rarity *
                500
        );
        const currentPercent = Math.floor(
            ((context.score - lastExpNeeded) / (expNeeded - lastExpNeeded)) *
                100
        );
        if (isNaN(currentPercent)) return 0;
        return currentPercent;
    };

    return (
        <div>
            <style>
                {`
                    .exp-bar {
                        width: 50%;
                        height: 24px;
                        border: 2px solid #fff;
                        overflow: hidden;
                        margin: auto;
                    }
                    .inner-exp-bar {
                        height: 100%;
                        background-color: #fff;
                        width: ${innerExpBar()}%;
                        color: var(--background-color);
                    }
                    `}
            </style>
            <div ref={stopRef}></div>
            {battleScreen}
            {loadingScreen}
            {levelUpScreen}
            {dialogScreen}
            <div className="status-bar">
                Floor {context.map.floor}: {context.map.name.replace(/_/g, " ")}{" "}
                <div className="exp-bar">
                    <div className="inner-exp-bar">{innerExpBar()}%</div>
                </div>
                Gold: {context.gold ? context.gold : 0}
            </div>
            <div ref={mapRef} id="map"></div>
            <div
                id="mobile-menu"
                onClick={() => {
                    unBindControls();
                    setDialogScreen(
                        <PauseScreen
                            bindControls={bindControls}
                            setParent={setDialogScreen}></PauseScreen>
                    );
                }}></div>
        </div>
    );
};

export default MapScreen;

async function getItemPrice(name, item) {
    const res = await fetch(process.env.REACT_APP_MIDDLEWARE_URL + "/get", {
        method: "GET",
        headers: {
            record: item,
            user: name,
        },
    });
    const res_1 = await res.json();
    return res_1[0];
}
