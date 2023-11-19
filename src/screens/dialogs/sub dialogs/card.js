import React, { useEffect } from "react";

export const Card = ({ card, i, length, onClick }) => {
    // distance from center
    const key = i - Math.ceil(length / 2);
    return (
        <div
            onClick={onClick}
            style={{ transform: `rotate(${(key / length) * 10}deg)` }}
            className="attack-card">
            <div className="attack-card-name">{card.name}</div>
            <div className="attack-card-damage">{card.damage}</div>
            <div className="attack-card-description">{card.description}</div>
            <div className="attack-card-type">{card.type}</div>
        </div>
    );
};

export default Card;
