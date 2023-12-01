import React, { useState, useEffect, useContext, useRef } from "react";
import CARDS from "../../assets/cards.json";
import Card from "../dialogs/sub dialogs/card";
import { AppContext } from "../../appContext";
import StatusModal from "./statusModal";

const DeckModal = ({ setParent }) => {
    const [context, setContext] = useContext(AppContext);
    const [deck, setDeck] = useState([]);
    const [renderedDeck, setRenderedDeck] = useState([]);
    const [collection, setCollection] = useState([]);
    const [renderedCollection, setRenderedCollection] = useState([]);
    const contextRef = useRef();
    contextRef.current = context;
    //initialize the deck from the context
    useEffect(() => {
        if (!contextRef.current.deck) return;
        setDeck(contextRef.current.deck);
    }, []);

    // set the collection of cards from the available cards
    useEffect(() => {
        const cards = Object.values(CARDS);
        const availableCards = cards.filter(
            (card) => card.level <= context.character.level
        );
        setCollection(availableCards);
    }, []);

    // render the collection of cards

    function addToDeck(card) {
        setDeck((oldDeck) => {
            if (oldDeck.includes(card)) return oldDeck;
            if (oldDeck.length >= 5) return oldDeck;
            return [...oldDeck, card];
        });
    }

    useEffect(() => {
        const newCollection = collection.map((card, index) => {
            return (
                <Card
                    onClick={() => addToDeck(card)}
                    card={card}
                    index={index}
                    key={index}
                />
            );
        });
        setRenderedCollection(newCollection);
    }, [collection]);

    // render the deck of cards
    function removeFromDeck(index) {
        const newDeck = deck.filter((card, i) => i !== index);
        setDeck(newDeck);
    }

    useEffect(() => {
        const newDeck = deck.map((card, index) => {
            return (
                <Card
                    onClick={() => removeFromDeck(index)}
                    card={card}
                    index={index}
                    key={index}
                />
            );
        });
        setRenderedDeck(newDeck);
        setContext((oldContext) => {
            return { ...oldContext, deck: deck };
        });
    }, [deck]);

    return (
        <>
            <div className="deck-container">{renderedCollection}</div>
            <div className="deck-container">{renderedDeck}</div>
            <button
                onClick={() => {
                    setParent(
                        <StatusModal setParent={setParent}></StatusModal>
                    );
                }}
                className="btn start-button">
                Back
            </button>
        </>
    );
};

export default DeckModal;
