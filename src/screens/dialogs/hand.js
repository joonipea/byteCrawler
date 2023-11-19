import React, { useEffect, useState } from "react";
import CARDS from "../../assets/cards.json";
import Card from "./sub dialogs/card";
const Hand = ({ stats, handleCards }) => {
    const [hand, setHand] = useState([]);
    const [renderedHand, setRenderedHand] = useState([]);
    useEffect(() => {
        const newHand = [];
        console.log(Object.keys(CARDS));
        for (let i = 0; i < 5; i++) {
            const randomCard =
                CARDS[
                    Object.keys(CARDS)[
                        Math.floor(Math.random() * Object.keys(CARDS).length)
                    ]
                ];
            const cardProfeciencies = randomCard.stats;
            let damage = 0;
            for (let profeciency of cardProfeciencies) {
                damage += Math.ceil(stats[profeciency[0]] * profeciency[1]);
            }
            randomCard.damage = damage;
            newHand.push(randomCard);
        }
        setHand(newHand);
    }, []);
    const renderHand = () => {
        console.log(hand);
        return hand.map((card, index) => {
            return (
                <Card
                    key={index}
                    i={index + 1}
                    length={hand.length}
                    card={card}
                    onClick={() => handleCards(card)}
                />
            );
        });
    };
    useEffect(() => {
        setRenderedHand(renderHand());
    }, [hand]);

    return <div className="hand">{renderedHand}</div>;
};

export default Hand;
