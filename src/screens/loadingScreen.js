import React, { useRef, useEffect } from "react";

const LoadingScreen = () => {
    const loadingScreen = useRef(null);
    useEffect(() => {
        let lineNumber = Math.ceil(window.innerHeight / 60);
        for (let i = 0; i < lineNumber; i++) {
            let line = document.createElement("div");
            line.className = "speed-line";
            line.style.left = Math.random() * 100 + "%";
            line.style.animationDelay = Math.random() * 2 + "s";
            line.style.animationDuration = Math.random() * 3 + 2 + "s";
            line.style.opacity = Math.random();
            loadingScreen.current.appendChild(line);

            let player = document.createElement("div");
            player.className = "player-sprite";
            loadingScreen.current.appendChild(player);
        }
    }, []);
    return (
        <div ref={loadingScreen} className="loading-screen">
            Loading...
        </div>
    );
};

export default LoadingScreen;
