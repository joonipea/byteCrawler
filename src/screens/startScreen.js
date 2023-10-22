import React, { useContext, useEffect } from "react";
import { AppContext } from "../appContext";

const StartScreen = () => {
    const [context, setContext] = useContext(AppContext);
    const loadGame = () => {
        const load = JSON.parse(localStorage.getItem("saveData"));
        if (load) {
            setContext(load);
        } else {
            setContext({ ...context, screen: "new" });
        }
    };

    useEffect(() => {
        const load = JSON.parse(localStorage.getItem("saveData"));
        if (!context.volume && load && load.volume) {
            setContext({ ...context, volume: load.volume });
        } else if (!context.volume) {
            setContext({ ...context, volume: 100 });
        }
    }, []);
    return (
        <div className="menu-container">
            <div className="title-container">byteCrawler</div>
            <button
                onClick={() => {
                    setContext({ ...context, screen: "new" });
                }}
                className="btn start-button">
                New Game
            </button>
            <button onClick={loadGame} className="btn load-button">
                Load
            </button>
            <button
                onClick={() => {
                    setContext({ ...context, screen: "settings" });
                }}
                className="btn settings-button">
                Settings
            </button>
            <button
                onClick={() => {
                    setContext({ ...context, screen: "credits" });
                }}
                className="btn credits-button">
                Credits
            </button>
            <button
                className="btn"
                onClick={() => {
                    window.close();
                }}>
                Quit
            </button>
        </div>
    );
};

export default StartScreen;
