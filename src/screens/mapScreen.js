import React, {
    useContext,
    useEffect,
    useRef,
    useCallback,
    useState,
} from "react";
import { AppContext } from "../appContext";
import LevelUpScreen from "./levelUpScreen";
import CARDS from "../assets/cards.json";
import {
    resetHand,
    createMap,
    spotlight,
    getCirlceRadius,
    moveEnemies,
    handleKeys,
    MovePlayerGlobal,
    pause,
} from "./utils";
import { changeScore } from "../hooks/stats";

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
    const contextRef = useRef(null);
    const stopRef = useRef(null);
    contextRef.current = context;

    //player movement

    let touchstartX = 0;
    let touchendX = 0;
    let touchstartY = 0;
    let touchendY = 0;

    const touchStartListener = useCallback((e) => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    }, []);
    const touchEndListener = useCallback((e) => {
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

    const keysListener = useCallback((e) => {
        handleKeys(
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
        );
    }, []);

    function bindControls() {
        console.trace("bindControls");
        document.addEventListener("keydown", keysListener);
        document.addEventListener("touchstart", touchStartListener);
        document.addEventListener("touchend", touchEndListener);
    }

    function unBindControls() {
        console.trace("unBindControls");
        document.removeEventListener("keydown", keysListener);
        document.removeEventListener("touchstart", touchStartListener);
        document.removeEventListener("touchend", touchEndListener);
    }

    function movePlayer(direction) {
        MovePlayerGlobal(
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
    //end player movement

    //save the game using up to date context
    const saveGame = useCallback(() => {
        let contextCopy = contextRef.current;
        localStorage.setItem("saveData", JSON.stringify(contextCopy));
    }, [context]);

    useEffect(() => {
        const map = document.getElementById("map");
        const player = document.querySelector(".player");
        const enemies = document.querySelectorAll("[class*= mobs]");
        for (const enemy of enemies) {
            moveEnemies(enemy);
        }
        if (map && player) {
            const circleRadius = getCirlceRadius(
                contextRef.current.character.inventory
            );
            spotlight(map, player, circleRadius);
        }
    }, [tick]);

    useEffect(() => {
        if (score <= 0) return;
        changeScore(setContext, score);
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
            resetHand(contextRef, context, setContext);
        }
    }, [score]);

    useEffect(() => {
        if (!context.map.map) return;
        mapRef.current.innerHTML = "";
        unBindControls();
        createMap(context.map.map, bindControls);
        const circleRadius = getCirlceRadius(
            contextRef.current.character.inventory
        );
        spotlight(
            document.getElementById("map"),
            document.querySelector(".player"),
            circleRadius
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
        setContext((oldContext) => {
            return {
                ...oldContext,
                url: "./music/map.wav",
            };
        });
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
                onClick={() =>
                    pause(unBindControls, setDialogScreen, bindControls)
                }></div>
        </div>
    );
};

export default MapScreen;
