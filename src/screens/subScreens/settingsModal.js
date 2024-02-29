import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../appContext";
import StatusModal from "./statusModal";

const SettingsModal = ({ setParent }) => {
    const [context, setContext] = useContext(AppContext);
    const [volume, setVolume] = useState(context.volume ? context.volume : 100);
    const [blurVal, setBlurVal] = useState(
        context.blurVal ? context.blurVal : 0
    );
    const [brightness, setBrightness] = useState(
        context.brightness ? context.brightness : 1
    );
    const [settings, setSettings] = useState({
        volume: volume,
        blurVal: blurVal,
        brightness: brightness,
    });

    useEffect(() => {
        setContext((oldContext) => ({ ...oldContext, volume: volume }));
        setSettings((oldSettings) => ({ ...oldSettings, volume: volume }));
    }, [volume]);

    useEffect(() => {
        setContext((oldContext) => ({ ...oldContext, blurVal: blurVal }));
        setSettings((oldSettings) => ({ ...oldSettings, blurVal: blurVal }));
        const crt = document.querySelector(".crt");
        let filter = crt.style.filter;
        if (!filter) {
            filter = `blur(${blurVal}px)`;
            crt.style.filter = filter;
        } else {
            const newFilter = filter.replace(
                /blur\((0|[1-9]\d*)(\.\d+)?px\)/,
                `blur(${blurVal}px)`
            );
            if (filter.includes(`blur`)) {
                crt.style.filter = newFilter;
            } else {
                crt.style.filter += ` blur(${blurVal}px)`;
            }
        }
    }, [blurVal]);

    useEffect(() => {
        setContext((oldContext) => ({ ...oldContext, brightness: brightness }));
        setSettings((oldSettings) => ({
            ...oldSettings,
            brightness: brightness,
        }));
        const crt = document.querySelector(".crt");
        let filter = crt.style.filter;
        if (!filter) {
            filter = `brightness(${brightness})`;
            crt.style.filter = filter;
        } else {
            let newFilter = filter.replace(
                /brightness\((0|[1-9]\d*)(\.\d+)?\)/,
                `brightness(${brightness})`
            );
            if (newFilter.includes("brightness")) {
                crt.style.filter = newFilter;
            } else {
                crt.style.filter += ` brightness(${brightness})`;
            }
        }
    }, [brightness]);

    useEffect(() => {
        let load = JSON.parse(localStorage.getItem("saveData"));
        let { volume, blurVal, brightness } = settings;
        if (load) {
            load.volume = volume;
            load.blurVal = blurVal;
            load.brightness = brightness;
            localStorage.setItem("saveData", JSON.stringify(load));
        } else {
            localStorage.setItem(
                "saveData",
                JSON.stringify({
                    ...context,
                    volume: volume,
                    blurVal: blurVal,
                    brightness: brightness,
                })
            );
        }
    }, [settings]);

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
            <div className="settings-label">
                <span>Blur</span>{" "}
                <input
                    value={blurVal}
                    onChange={(e) => setBlurVal(e.target.value)}
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    id="blur"></input>
            </div>
            <div className="settings-label">
                <span>Brightness</span>{" "}
                <input
                    value={brightness}
                    onChange={(e) => setBrightness(e.target.value)}
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    id="brightness"></input>
            </div>

            <button
                onClick={() => {
                    setParent(
                        <StatusModal setParent={setParent}></StatusModal>
                    );
                }}
                className="btn start-button">
                Back
            </button>
        </div>
    );
};

export default SettingsModal;
