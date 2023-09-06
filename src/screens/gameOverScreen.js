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
                stopRef.current.addEventListener("click", () => {
                    source.stop();
                });
            }, length);
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
            <button onClick={() => loadScreen()} className="btn">
                Continue
            </button>
        </div>
    );
};

export default GameOverScreen;
