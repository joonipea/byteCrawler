import React, { useContext, useEffect, useRef } from "react";
import { AppContext } from "../appContext";
const hints = [
    "If you find yourself dying a lot, your character might be too weak. Try starting a new game with the same name.",
    "Enemies will only follow you if they're within 3 tiles of you.",
    "Yellow tiles are save points. Use them.",
    "If you're low health. Run.",
    "Keep trying! It may take you a few tries to find a good route.",
    "If you're stuck, try starting a new game with the different name.",
    "There's a 10% chance for a floor to have a healing well.",
    "There's a 10% chance for a floor to have a save point.",
    "Light blue tiles are healing wells. Use them.",
    "This game is full of glitches. If you find one, exploit it.",
    "Some characters level up faster than others.",
    "Some characters are stronger than others.",
    "Characters that start stronger level up slower.",
    "Luck handles more than just critical hits.",
    "Luck determines damage range.",
    "Luck determines battle order.",
];

const GameOverScreen = () => {
    const [context, setContext] = useContext(AppContext);
    const stopRef = useRef();

    function startScreen() {
        window.location.reload();
    }
    function loadScreen() {
        const load = JSON.parse(localStorage.getItem("saveData"));
        if (load) {
            setContext(load);
        } else {
            setContext({ ...context, screen: "start" });
        }
        stopRef.current.click();
    }

    async function townScreen() {
        let townMap = await getTownMap();
        let character = await getNewCharacter();
        let newCharacter =
            character[Math.floor(Math.random() * character.length)];
        setContext((oldContext) => {
            return {
                ...oldContext,
                map: townMap,
                screen: "map",
                character: newCharacter,
                score: 0,
            };
        });
        stopRef.current.click();
    }

    async function getTownMap() {
        let townMap;
        let response = await fetch(
            process.env.REACT_APP_MIDDLEWARE_URL + "/generateTown",
            {
                method: "GET",
                headers: {
                    user: context.worldName,
                    floor: 0,
                },
            }
        );
        let data = await response.json();
        townMap = data[0];
        return townMap;
    }

    async function getNewCharacter() {
        let character;
        let response = await fetch(
            process.env.REACT_APP_MIDDLEWARE_URL + "/get",
            {
                method: "GET",
                headers: {
                    user: context.worldName,
                    record: "chars",
                },
            }
        );
        let data = await response.json();
        character = data;
        return character;
    }

    useEffect(() => {
        var url = "./music/GAME OVER.wav";
        let audio_context = new AudioContext();
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

        let deadChime = new Audio("./music/DEAD.wav");
        deadChime.addEventListener("canplaythrough", (event) => {
            deadChime.volume = context.volume / 100;
            deadChime.play();
            let length = deadChime.duration * 1000;
            setTimeout(() => {
                request.send();
            }, length);
        });
        stopRef.current.addEventListener("click", () => {
            deadChime.pause();
            audio_context.close();
        });
    }, []);

    return (
        <div className="menu-container">
            <div ref={stopRef}></div>
            <div className="title-container">Game Over</div>
            <p style={{ textAlign: "center", width: "75%" }}>
                Hint: {hints[Math.floor(Math.random() * hints.length)]}
            </p>
            <button onClick={() => startScreen()} className="btn">
                Return to title
            </button>
            <button onClick={() => townScreen()} className="btn">
                Return to town
            </button>
        </div>
    );
};

export default GameOverScreen;
