import React, { useContext, useEffect, useRef } from "react";
import { AppContext } from "../appContext";
const hints = [
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
];

const GameOverScreen = () => {
    const [context, setContext] = useContext(AppContext);
    const stopRef = useRef();
    const spiritMessage = useRef();
    const reincarnate = useRef();
    const title = useRef();
    const ghost = useRef();

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
        let message = `The spirit of ${newCharacter.name.replaceAll(
            "_",
            " "
        )} has entered the golem.<br>`;
        let { stats } = newCharacter;
        let { health, maxHealth, attack, defense, luck } = stats;
        let statMessage = `Stats:<br>${health}/${maxHealth} HP<br>${attack} ATK<br>${defense} DEF<br>${luck} LCK`;
        message += statMessage;
        spiritMessage.current.innerHTML = message;
        title.current.style.display = "none";
        reincarnate.current.style.display = "none";
        ghost.current.style.animation = "floatDown 1s ease-in-out forwards";
        setTimeout(() => {
            setContext((oldContext) => {
                return {
                    ...oldContext,
                    map: townMap,
                    screen: "map",
                    character: newCharacter,
                    score: 0,
                    hand: [],
                    deck: [],
                };
            });
            stopRef.current.click();
        }, 10000);
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
        <div
            style={{ justifyContent: "flex-start !important" }}
            className="menu-container">
            <div ref={stopRef}></div>
            <div className="title-container">Game Over</div>
            <div ref={ghost} className="ghost-container"></div>
            <div className="art-container--gameover"></div>
            <p
                style={{ textAlign: "center", width: "75%" }}
                ref={spiritMessage}></p>
            <p style={{ textAlign: "center", width: "75%" }}>
                Hint: {hints[Math.floor(Math.random() * hints.length)]}
            </p>
            <button
                ref={reincarnate}
                onClick={() => townScreen()}
                className="btn">
                Reincarnate
            </button>
            <button ref={title} onClick={() => startScreen()} className="btn">
                Return to title
            </button>
        </div>
    );
};

export default GameOverScreen;
