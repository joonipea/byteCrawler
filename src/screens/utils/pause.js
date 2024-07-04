import PauseScreen from "../pauseScreen";

export default function pause(unBindControls, setDialogScreen, bindControls) {
    unBindControls();
    setDialogScreen(
        <PauseScreen
            bindControls={bindControls}
            setParent={setDialogScreen}></PauseScreen>
    );
}
