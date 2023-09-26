import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../appContext";
import LoadingScreen from "./loadingScreen";

const NewGameScreen = () => {
    const [loading, setLoading] = useState(false);
    const [loadingScreen, setLoadingScreen] = useState(<></>);
    const [context, setContext] = useContext(AppContext);
    const [name, setName] = useState("");

    function createWorld(name) {
        setLoadingScreen(<LoadingScreen></LoadingScreen>);
        setLoading(true);
        fetch(process.env.REACT_APP_MIDDLEWARE_URL + "/generateWorld", {
            method: "GET",
            headers: {
                user: name,
            },
        })
            .then(() => {
                generateMap(name, setContext, context, 0).then((response) => {
                    response.json().then((maps) => {
                        getRecord(name, "chars").then((res) => {
                            res.json().then((chars) => {
                                const charIndex = Math.floor(
                                    Math.random() * chars.length
                                );
                                console.log(chars[charIndex]);
                                const newContext = {
                                    ...context,
                                    screen: "map",
                                    maps: maps,
                                    map: maps[0],
                                    character: chars[charIndex],
                                    worldName: name,
                                };
                                setContext(newContext);
                                localStorage.setItem(
                                    "saveData",
                                    JSON.stringify(newContext)
                                );
                            });
                        });
                    });
                });
            })
            .catch((error) => {
                setLoadingScreen(<></>);
                setLoading(false);
                console.log(error);
            });
    }

    return (
        <div className="menu-container">
            {loadingScreen}
            <p>Name your world</p>
            <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                className="input"
                minLength={3}
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
