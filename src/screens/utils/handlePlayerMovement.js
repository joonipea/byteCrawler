import { pause, cheat, resetHand } from ".";
import nextMap from "./nextMap";
import DialogScreen from "../dialogScreen";
import BattleScreen from "../battleScreen";
import LoadingScreen from "../loadingScreen";
import { changeGold, changeStat } from "../../hooks/stats";
import { cacheItem } from "../../hooks/cache";

export function handleKeys(
    e,
    unBindControls,
    setLoadingScreen,
    contextRef,
    context,
    setContext,
    setNextFloor,
    setDialogScreen,
    bindControls,
    setBattleScreen,
    setScore,
    stopRef,
    saveGame,
    setTick
) {
    switch (e.key) {
        case "ArrowUp":
            movePlayerWrapper("up");
            break;
        case "ArrowDown":
            movePlayerWrapper("down");
            break;
        case "ArrowLeft":
            movePlayerWrapper("left");
            break;
        case "ArrowRight":
            movePlayerWrapper("right");
            break;
        case "Escape":
            pause(unBindControls, setDialogScreen, bindControls);
            break;
        case "`":
            cheat(unBindControls, setDialogScreen, bindControls);
            break;
        default:
            break;
    }
    function movePlayerWrapper(direction) {
        movePlayer(
            direction,
            unBindControls,
            setLoadingScreen,
            contextRef,
            context,
            setContext,
            setNextFloor,
            setDialogScreen,
            bindControls,
            setBattleScreen,
            setScore,
            stopRef,
            saveGame,
            setTick
        );
    }
}

export function movePlayer(
    direction,
    unBindControls,
    setLoadingScreen,
    contextRef,
    context,
    setContext,
    setNextFloor,
    setDialogScreen,
    bindControls,
    setBattleScreen,
    setScore,
    stopRef,
    saveGame,
    setTick
) {
    const player = document.querySelector(".player");
    const playerParent = player.parentElement;
    const playerIndex = Array.from(playerParent.children).indexOf(player);
    let nextCell;
    nextCell = setNextCell(
        direction,
        nextCell,
        playerParent,
        playerIndex,
        player
    );
    handleNextCell(
        nextCell,
        unBindControls,
        setLoadingScreen,

        contextRef,
        context,
        setContext,
        setNextFloor,
        setDialogScreen,
        bindControls,
        setBattleScreen,
        setScore,
        stopRef,
        saveGame,
        setTick
    );
}

function handleNextCell(
    nextCell,
    unBindControls,
    setLoadingScreen,

    contextRef,
    context,
    setContext,
    setNextFloor,
    setDialogScreen,
    bindControls,
    setBattleScreen,
    setScore,
    stopRef,
    saveGame,
    setTick
) {
    if (!nextCell) return;
    const player = document.querySelector(".player");
    const isMob = (cell) =>
        Array.from(cell.classList).some((c) => c.startsWith("mobs"));
    const isItem = (cell) =>
        Array.from(cell.classList).some((c) => c.startsWith("items"));
    const isTomb = (cell) =>
        Array.from(cell.classList).some((c) => c.startsWith("chars"));
    if (nextCell.classList.contains("exit")) {
        handleExit(
            unBindControls,
            setLoadingScreen,
            contextRef,
            context,
            setContext,
            setNextFloor
        );
    }
    if (isTomb(nextCell)) {
        handleTomb(
            unBindControls,
            nextCell,
            setDialogScreen,
            bindControls,
            setBattleScreen,
            setScore,
            stopRef
        );
    }
    if (isMob(nextCell)) {
        handleMobEncounter(
            unBindControls,
            nextCell,
            setBattleScreen,
            setScore,
            bindControls,
            stopRef
        );
    }
    if (isItem(nextCell)) {
        handleItem(nextCell, context, contextRef, setContext);
    }
    if (nextCell.classList.contains("well")) {
        changeStat(
            setContext,
            "health",
            contextRef.current.character.stats.maxHealth
        );
    }

    if (nextCell.classList.contains("dungeon")) {
        handleDungeon(setContext);
    }
    if (nextCell.classList.contains("monolith")) {
        handleMonolith(unBindControls, setDialogScreen, bindControls);
    }
    if (nextCell.classList.contains("temple")) {
        handleTemple(unBindControls, setDialogScreen, setScore, bindControls);
    }
    if (nextCell.classList.contains("merchant")) {
        handleMerchant(unBindControls, setDialogScreen, bindControls);
    }
    if (nextCell.classList.contains("save")) {
        saveGame();
    }
    if (!nextCell.classList.contains("wall")) {
        handleWall(player, nextCell, setTick);
    }
}

function handleWall(player, nextCell, setTick) {
    player.classList.remove("player");
    nextCell.classList.add("player");
    setTick((oldTick) => oldTick + 1);
}

function handleMerchant(unBindControls, setDialogScreen, bindControls) {
    unBindControls();
    setDialogScreen(
        <DialogScreen
            type={"merchant"}
            bindControls={bindControls}
            setParent={setDialogScreen}></DialogScreen>
    );
}

function handleTemple(unBindControls, setDialogScreen, setScore, bindControls) {
    unBindControls();
    setDialogScreen(
        <DialogScreen
            type={"temple"}
            setScore={setScore}
            bindControls={bindControls}
            setParent={setDialogScreen}></DialogScreen>
    );
}

function handleMonolith(unBindControls, setDialogScreen, bindControls) {
    unBindControls();
    setDialogScreen(
        <DialogScreen
            type={"monolith"}
            bindControls={bindControls}
            setParent={setDialogScreen}></DialogScreen>
    );
}

function handleDungeon(setContext) {
    setContext((oldContext) => {
        return {
            ...oldContext,
            map: oldContext.maps[0],
        };
    });
}

function handleItem(nextCell, context, contextRef, setContext) {
    const iName = nextCell.classList[1].split(":")[1];
    if (context.codex[iName]) {
        const currentGold = contextRef.current.gold
            ? contextRef.current.gold
            : 0;
        const newGold = currentGold + context.codex[iName].price;
        changeGold(setContext, newGold);
        nextCell.classList.remove(nextCell.classList[1]);
        nextCell.classList.add("open-chest");
    } else {
        getItemPrice(context.worldName, nextCell.classList[1]).then((item) => {
            const currentGold = contextRef.current.gold
                ? contextRef.current.gold
                : 0;
            cacheItem(setContext, item);
            const newGold = currentGold + item.price;
            changeGold(setContext, newGold);
            nextCell.classList.remove(nextCell.classList[1]);
            nextCell.classList.add("open-chest");
        });
    }
}

function handleMobEncounter(
    unBindControls,
    nextCell,
    setBattleScreen,
    setScore,
    bindControls,
    stopRef
) {
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

function handleTomb(
    unBindControls,
    nextCell,
    setDialogScreen,
    bindControls,
    setBattleScreen,
    setScore,
    stopRef
) {
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

function handleExit(
    unBindControls,
    setLoadingScreen,
    contextRef,
    context,
    setContext,
    setNextFloor
) {
    unBindControls();
    setLoadingScreen(<LoadingScreen></LoadingScreen>);
    nextMap(contextRef, setNextFloor, setLoadingScreen, setContext);
    resetHand(contextRef, context, setContext);
}

function setNextCell(direction, nextCell, playerParent, playerIndex, player) {
    switch (direction) {
        case "up":
            const pes = playerParent.previousElementSibling;
            nextCell = pes ? pes.children[playerIndex] : undefined;
            break;
        case "down":
            const nes = playerParent.nextElementSibling;
            nextCell = nes ? nes.children[playerIndex] : undefined;
            break;
        case "left":
            nextCell = player.previousElementSibling;
            break;
        case "right":
            nextCell = player.nextElementSibling;
            break;
        default:
            break;
    }
    return nextCell;
}

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
