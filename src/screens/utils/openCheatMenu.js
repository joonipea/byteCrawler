import CheatMenu from "../subScreens/cheatMenu";

export default function cheat(unBindControls, setDialogScreen, bindControls) {
    unBindControls();
    setDialogScreen(
        <CheatMenu
            bindControls={bindControls}
            setParent={setDialogScreen}></CheatMenu>
    );
}
