import React, {
    useEffect,
    useState,
    useContext,
    forwardRef,
    useRef,
} from "react";
import CARDS from "../../assets/cards.json";
import Card from "./sub dialogs/card";
import { AppContext } from "../../appContext";

const Hand = forwardRef(function Hand({ stats, level, handleCards }, ref) {
    const [hand, setHand] = useState([]);
    const [renderedHand, setRenderedHand] = useState([]);
    const [context, setContext] = useContext(AppContext);
    const contextRef = useRef();
    contextRef.current = context;

    // set available cards from context deck if it doesn't exist set the first 5 available cards equal to or less than the level
    function getAvailableCards() {
        if (contextRef.current.deck && contextRef.current.deck.length > 0) {
            return contextRef.current.deck;
        }
        const cards = Object.values(CARDS);
        return cards.filter((card) => card.level <= context.character.level);
    }
    const pickCard = (level) => {
        const availableCards = getAvailableCards();

        const cardNames = availableCards.map((card) => card.key);
        console.log(availableCards);
        const randomCard =
            CARDS[cardNames[Math.floor(Math.random() * cardNames.length)]];
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
        if (context.hand && context.hand.length > 0) {
            setHand(context.hand);
            return;
        }
        const newHand = [];
        for (let i = 0; i < 5; i++) {
            let randomCard = pickCard(level);
            newHand.push(addToHand(randomCard));
        }
        setHand(newHand);
        setContext((oldContext) => {
            return { ...oldContext, hand: newHand };
        });
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
            setContext((oldContext) => {
                return { ...oldContext, hand: newHand };
            });
            return;
        }
        const newCards = [];
        const newCardsLength = Math.min(Math.ceil(stats.luck / 10), 7);
        for (let i = 0; i < newCardsLength; i++) {
            const randomCard = pickCard(level);
            const cardProfeciencies = randomCard.stats;
            let damage = 0;
            for (let profeciency of cardProfeciencies) {
                damage += Math.ceil(stats[profeciency[0]] * profeciency[1]);
            }
            randomCard.damage = damage;
            newCards.push(randomCard);
        }

        setHand(newCards);
        setContext((oldContext) => {
            return { ...oldContext, hand: newCards };
        });
    };

    const renderHand = () => {
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
