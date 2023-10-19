import React, { useEffect, useState } from "react";
import Monolith from "./dialogs/monolith";
import Temple from "./dialogs/temple";
import Merchant from "./dialogs/merchant";
import Ghost from "./dialogs/ghost";

const DialogScreen = ({
    setParent,
    setScore,
    type,
    bindControls,
    setBattleScreen,
}) => {
    const [dialogText, setDialogText] = useState("");
    useEffect(() => {
        switch (type) {
            case "monolith":
                setDialogText(<Monolith />);
                break;
            case "temple":
                setDialogText(<Temple setScore={setScore} />);
                break;
            case "merchant":
                setDialogText(<Merchant />);
                break;
            case "ghost":
                setDialogText(
                    <Ghost
                        setBattleScreen={setBattleScreen}
                        setParent={setParent}
                    />
                );
            default:
                break;
        }
    }, [type]);
    return (
        <div className="dialog-screen">
            {dialogText}
            <button
                className="btn"
                onClick={() => {
                    bindControls();
                    setParent([]);
                }}>
                Leave
            </button>
        </div>
    );
};

export default DialogScreen;
