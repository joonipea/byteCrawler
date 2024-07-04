import CARDS from "../../assets/cards.json";

function getAvailableCards(contextRef, context) {
    if (contextRef.current.deck && contextRef.current.deck.length > 0) {
        return contextRef.current.deck;
    }
    const cards = Object.values(CARDS);
    return cards.filter((card) => card.level <= context.character.level);
}

function pickCard(level, contextRef, context) {
    const availableCards = getAvailableCards(contextRef, context);
    const cardNames = availableCards.map((card) => card.key);
    const randomCard =
        CARDS[cardNames[Math.floor(Math.random() * cardNames.length)]];
    if (randomCard.level <= level) return randomCard;
    return pickCard(level, contextRef, context);
}

function addToHand(card, contextRef, setContext) {
    const contextCopy = contextRef.current;
    if (!contextCopy.hand) {
        setContext((oldContext) => {
            return {
                ...oldContext,
                hand: [card],
            };
        });
        return;
    }
    setContext((oldContext) => {
        return {
            ...oldContext,
            hand: [...oldContext.hand, card],
        };
    });
    return;
}

export default function resetHand(contextRef, context, setContext) {
    const contextCopy = contextRef.current;
    const cardsNeeded = 5 - contextCopy.hand.length;
    for (let i = 0; i < cardsNeeded; i++) {
        const randomCard = pickCard(
            contextRef.current.character.level,
            contextRef,
            context
        );
        const stats = contextRef.current.character.stats;
        const cardProfeciencies = randomCard.stats;
        let damage = 0;
        for (let profeciency of cardProfeciencies) {
            damage += Math.ceil(stats[profeciency[0]] * profeciency[1]);
        }
        randomCard.damage = damage;
        addToHand(randomCard, contextRef, setContext);
    }
}
