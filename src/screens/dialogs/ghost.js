import React from "react";

const Ghost = ({ setBattleScreen, setParent }) => {
    return (
        <>
            <p>Put this poor soul to rest?</p>
            <button
                className="btn"
                onClick={() => {
                    setBattleScreen();
                    setParent([]);
                }}>
                Yes
            </button>
        </>
    );
};

export default Ghost;
