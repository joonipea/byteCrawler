import React, { useContext, useEffect } from "react";
import "./App.css";
import { AppContext } from "./appContext";
import StartScreen from "./screens/startScreen";
import PullScreen from "./screens/pullScreen";
import SellScreen from "./screens/sellScreen";
import MapScreen from "./screens/mapScreen";
import NewGameScreen from "./screens/newGameScreen";
import GameOverScreen from "./screens/gameOverScreen";
import SettingsScreen from "./screens/settingsScreen";
import CreditsScreen from "./screens/creditsScreen";
import JukeBox from "./hooks/audio"
const App = () => {
    const [context, setContext] = useContext(AppContext);

    useEffect(() => {
        if (!context.screen) {
            setContext({ ...context, screen: "start" });
        }
    }, []);

    return (
        <>
            <JukeBox />
            {context.screen === "start" && <StartScreen></StartScreen>}
            {context.screen === "new" && <NewGameScreen></NewGameScreen>}
            {context.screen === "pull" && <PullScreen></PullScreen>}
            {context.screen === "sell" && <SellScreen></SellScreen>}
            {context.screen === "map" && <MapScreen></MapScreen>}
            {context.screen === "gameover" && <GameOverScreen></GameOverScreen>}
            {context.screen === "settings" && <SettingsScreen></SettingsScreen>}
            {context.screen === "credits" && <CreditsScreen></CreditsScreen>}
        </>
    );
};

export default App;
