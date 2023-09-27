import React, { useState, useEffect } from "react";
import StatusModal from "./subScreens/statusModal";

const PauseScreen = ({ setParent, handleKeys }) => {
    const [pageContent, setPageContent] = useState(<></>);

    useEffect(() => {
        setPageContent(<StatusModal setParent={setPageContent}></StatusModal>);
    }, []);

    return (
        <div className="pause-container">
            <div className="toolbar">
                <div className="pause-title">Paused</div>

                <button
                    className="btn"
                    onClick={() => {
                        setParent([]);
                        document.addEventListener("keydown", handleKeys);
                    }}>
                    X
                </button>
            </div>
            <div className="pause-content">{pageContent}</div>
        </div>
    );
};

export default PauseScreen;
