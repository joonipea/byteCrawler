import React, { useEffect, useState } from "react";
import Monolith from "./dialogs/monolith";
import Temple from "./dialogs/temple";
import Merchant from "./dialogs/merchant";

const DialogScreen = ({ setParent, setScore, type, handleKeys }) => {
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
                    document.addEventListener("keydown", handleKeys);
                    setParent([]);
                }}>
                Leave
            </button>
        </div>
    );
};

export default DialogScreen;
