import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../appContext";

const SettingsScreen = () => {
    const [context, setContext] = useContext(AppContext);
    const [volume, setVolume] = useState(context.volume ? context.volume : 100);

    useEffect(() => {
        setContext((oldContext) => ({ ...oldContext, volume: volume }));
        let load = JSON.parse(localStorage.getItem("saveData"));
        if (load) {
            load.volume = volume;
            localStorage.setItem("saveData", JSON.stringify(load));
        } else {
            localStorage.setItem(
                "saveData",
                JSON.stringify({ ...context, volume: volume })
            );
        }
    }, [volume]);

    return (
        <div className="menu-container">
            <div className="title-container">Settings</div>
            <div className="settings-label">
                <span>Volume</span>{" "}
                <input
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    type="range"
                    min="0"
                    max="100"
                    id="volume"></input>
            </div>

            <button
                onClick={() => {
                    setContext({ ...context, screen: "start" });
                }}
                className="btn start-button">
                Back
            </button>
        </div>
    );
};

export default SettingsScreen;
