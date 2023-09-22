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

const MapScreen = () => {
    const [context, setContext] = useContext(AppContext);
    const [nextFloor, setNextFloor] = useState({});
    const [battleScreen, setBattleScreen] = useState([]);
    const [levelUpScreen, setLevelUpScreen] = useState([]);
    const mapRef = useRef(null);
    const [tick, setTick] = useState(0);
    const [score, setScore] = useState(context.score ? context.score : 0);
    const [gold, setGold] = useState(context.gold ? context.gold : 0);
    const contextRef = useRef(null);
    const stopRef = useRef(null);
    contextRef.current = context;
    var audio_context;

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
        document.addEventListener("keydown", handleKeys);
    }

    //bind arrowkeys to movement
    const handleKeys = useCallback((e) => {
        if (e.key === "ArrowUp") {
            movePlayer("up");
        }
        if (e.key === "ArrowDown") {
            movePlayer("down");
        }
        if (e.key === "ArrowLeft") {
            movePlayer("left");
        }
        if (e.key === "ArrowRight") {
            movePlayer("right");
        }
    }, []);

    function movePlayer(direction) {
        const player = document.querySelector(".player");
        const playerParent = player.parentElement;
        const playerIndex = Array.from(playerParent.children).indexOf(player);
        const isMob = (cell) =>
            Array.from(cell.classList).some((c) => c.startsWith("mobs"));
        const isItem = (cell) =>
            Array.from(cell.classList).some((c) => c.startsWith("items"));
        let nextCell;
        if (direction === "up") {
            nextCell = playerParent.previousElementSibling
                ? playerParent.previousElementSibling.children[playerIndex]
                : undefined;
            playerParent.previousElementSibling.children[playerIndex];
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
        if (nextCell && nextCell.classList.contains("exit")) {
            nextMap();
        }
        if (nextCell && isMob(nextCell)) {
            document.removeEventListener("keydown", handleKeys);
            const mobClass = nextCell.classList[nextCell.classList.length - 1];
            setBattleScreen(
                <BattleScreen
                    setParent={setBattleScreen}
                    mob={mobClass}
                    cell={nextCell}
                    setScore={setScore}
                    handleKeys={handleKeys}
                    mapMusic={stopRef.current}
                />
            );
        }
        if (nextCell && isItem(nextCell)) {
            getItemPrice(context.worldName, nextCell.classList[1]).then(
                (price) => {
                    setGold((oldGold) => oldGold + price);
                    nextCell.classList.remove(nextCell.classList[1]);
                    nextCell.classList.add("floor");
                }
            );
        }
        if (nextCell && nextCell.classList.contains("well")) {
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

        if (nextCell && nextCell.classList.contains("save")) {
            saveGame();
        }
        if (nextCell && !nextCell.classList.contains("wall")) {
            player.classList.remove("player");
            nextCell.classList.add("player");
            setTick((oldTick) => oldTick + 1);
        }
    }

    function spotlight(map, player) {
        const mapBounds = map.getBoundingClientRect();
        const playerBounds = player.getBoundingClientRect();
        const playerCenter = {
            x: playerBounds.x - mapBounds.x + playerBounds.width / 2,
            y: playerBounds.y - mapBounds.y + playerBounds.height / 2,
        };
        map.style.clipPath = `circle(calc(75 / 21 * 3lvmin - 2px) at ${playerCenter.x}px ${playerCenter.y}px)`;
    }

    const nextMap = useCallback(() => {
        let contextCopy = contextRef.current;
        if (!contextCopy.maps[contextCopy.map.floor]) {
            generateMap(contextCopy.worldName, contextCopy.map.floor)
                .then((res) => res.json())
                .then((newFloor) => {
                    setNextFloor(newFloor[0]);
                });
        } else {
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    map: oldContext.maps[oldContext.map.floor],
                };
            });
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
        console.log("game saved");
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

    useEffect(() => {
        if (score > 0) {
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    score: score,
                };
            });
        }
        if (
            score >
            context.character.level ** 1.3 * context.character.rarity * 500
        ) {
            setLevelUpScreen(
                <LevelUpScreen setParent={setLevelUpScreen}></LevelUpScreen>
            );
        }
    }, [score]);

    useEffect(() => {
        if (gold > 0) {
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    gold: gold,
                };
            });
        }
    }, [gold]);

    useEffect(() => {
        if (context.map.map) {
            mapRef.current.innerHTML = "";
            document.removeEventListener("keydown", handleKeys);
            createMap(context.map.map);
            spotlight(
                document.getElementById("map"),
                document.querySelector(".player")
            );
        }
    }, [context.map.map]);

    useEffect(() => {
        if (nextFloor.map) {
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    maps: [...oldContext.maps, nextFloor],
                    map: nextFloor,
                };
            });
        }
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

    return (
        <div>
            <div ref={stopRef}></div>
            {battleScreen}
            {levelUpScreen}
            <p style={{ textAlign: "center" }}>
                Floor {context.map.floor}: {context.map.name} - Score:{" "}
                {context.score ? context.score : 0} - Gold:{" "}
                {context.gold ? context.gold : 0}
            </p>
            <div ref={mapRef} id="map"></div>
        </div>
    );
};

export default MapScreen;

function getItemPrice(name, item) {
    return fetch(process.env.REACT_APP_MIDDLEWARE_URL + "/get", {
        method: "GET",
        headers: {
            record: item,
            user: name,
        },
    })
        .then((res) => res.json())
        .then((res) => res[0].price);
}
