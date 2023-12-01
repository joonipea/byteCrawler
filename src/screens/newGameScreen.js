import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../appContext";
import LoadingScreen from "./loadingScreen";

const NewGameScreen = () => {
    const [loading, setLoading] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(<></>);
    const [context, setContext] = useContext(AppContext);
    const [name, setName] = useState("");

    async function createWorld(name) {
        try {
            setLoadingScreen(<LoadingScreen></LoadingScreen>);
            setLoading(true);
            const url = process.env.REACT_APP_MIDDLEWARE_URL + "/generateWorld";
            const body = {
                method: "GET",
                headers: {
                    user: name,
                },
            };
            await fetch(url, body);
            const response = await generateMap(name, setContext, context, 0);
            const maps = await response.json();
            const response_2 = await getRecord(name, "chars");
            const chars = await response_2.json();
            const response_3 = await getRecord(name, "mobs");
            const mobs = await response_3.json();
            const bestiary = {};
            for (let mob of mobs) {
                bestiary[mob.name] = mob;
            }
            const response_4 = await getRecord(name, "items");
            const items = await response_4.json();
            const codex = {};
            for (let item of items) {
                codex[item.name] = item;
            }
            const charIndex = Math.floor(Math.random() * chars.length);
            const newContext = {
                ...context,
                screen: "map",
                maps: maps,
                map: maps[0],
                character: chars[charIndex],
                worldName: name,
                bestiary: bestiary,
                codex: codex,
                hand: [],
                deck: [],
            };
            setContext(newContext);
            localStorage.setItem("saveData", JSON.stringify(newContext));
        } catch (error) {
            setLoadingScreen(<></>);
            setLoading(false);
            console.log(error);
        }
    }

    return (
        <div className="menu-container">
            {loadingScreen}
            <p>Name your world</p>
            <input
                onChange={(e) => {
                    let value = e.target.value;

                    value = value.replace(/[^A-Za-z]/gi, "");
                    setName(value);
                }}
                value={name}
                type="text"
                className="input"
                minLength={3}
                onKeyDown={(e) => {
                    return /[a-z]/i.test(e.key);
                }}
            />
            <button
                disabled={loading}
                onClick={() => {
                    createWorld(name);
                }}
                className="btn start-button">
                {loading ? "Loading..." : "Start"}
            </button>
        </div>
    );
};

export default NewGameScreen;
function generateMap(name, setContext, context) {
    return fetch(process.env.REACT_APP_MIDDLEWARE_URL + "/get", {
        method: "GET",
        headers: {
            user: name,
            record: "maps",
        },
    });
}

function getRecord(name, record) {
    return fetch(process.env.REACT_APP_MIDDLEWARE_URL + "/get", {
        method: "GET",
        headers: {
            record: record,
            user: name,
        },
    });
}
