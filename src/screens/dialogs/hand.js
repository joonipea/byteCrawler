import React, { useEffect, useState, useContext, forwardRef } from "react";
import CARDS from "../../assets/cards.json";
import Card from "./sub dialogs/card";
import { AppContext } from "../../appContext";

const Hand = forwardRef(function Hand({ stats, level, handleCards }, ref) {
    const [hand, setHand] = useState([]);
    const [renderedHand, setRenderedHand] = useState([]);
    const [context, setContext] = useContext(AppContext);

    const pickCard = (level) => {
        const randomCard =
            CARDS[
                Object.keys(CARDS)[
                    Math.floor(Math.random() * Object.keys(CARDS).length)
                ]
            ];
        if (randomCard.level <= level) return randomCard;
        return pickCard(level);
    };

    useEffect(() => {
        if (!context.newCards || context.newCards.length == 0) return;
        let newHand = [...hand];
        for (let cardName of context.newCards) {
            let card = CARDS[cardName];
            newHand.push(addToHand(card));
        }
        setHand(newHand);
        setContext((oldContext) => {
            return { ...oldContext, newCards: [] };
        });
    }, [context.newCards]);

    useEffect(() => {
        const newHand = [];
        console.log(Object.keys(CARDS));
        for (let i = 0; i < 5; i++) {
            let randomCard = pickCard(level);
            newHand.push(addToHand(randomCard));
        }
        setHand(newHand);
    }, []);

    function addToHand(card) {
        let newCard = card;
        const cardProfeciencies = newCard.stats;
        let damage = 0;
        for (let profeciency of cardProfeciencies) {
            damage += Math.ceil(stats[profeciency[0]] * profeciency[1]);
        }
        newCard.damage = damage;
        return newCard;
    }

    const discardCard = (index) => {
        const newHand = hand.filter((c, i) => i !== index);
        if (newHand.length > 0) {
            setHand(newHand);
            return;
        }
        const randomCard = pickCard(level);
        const cardProfeciencies = randomCard.stats;
        let damage = 0;
        for (let profeciency of cardProfeciencies) {
            damage += Math.ceil(stats[profeciency[0]] * profeciency[1]);
        }
        randomCard.damage = damage;
        setHand([randomCard]);
    };

    const renderHand = () => {
        console.log(hand);
        return hand.map((card, index) => {
            return (
                <Card
                    key={index}
                    i={index + 1}
                    length={hand.length}
                    card={card}
                    onClick={() => {
                        handleCards(card);
                        discardCard(index);
                    }}
                />
            );
        });
    };
    useEffect(() => {
        setRenderedHand(renderHand());
    }, [hand]);

    return (
        <div ref={ref} className="hand">
            {renderedHand}
        </div>
    );
});

export default Hand;
