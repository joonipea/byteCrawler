const changeGold = (setContext, amount) => {
    setContext((oldContext) => {
        return {
            ...oldContext,
            gold: amount,
        };
    });
};

const changeScore = (setContext, amount) => {
    setContext((oldContext) => {
        return {
            ...oldContext,
            score: amount,
        };
    });
};

const changeStat = (setContext, stat, amount) => {
    setContext((oldContext) => {
        return {
            ...oldContext,
            character: {
                ...oldContext.character,
                stats: {
                    ...oldContext.character.stats,
                    [stat]: amount,
                },
            },
        };
    });
};

const addItem = (setContext, item) => {
    setContext((oldContext) => {
        return {
            ...oldContext,
            character: {
                ...oldContext.character,
                inventory: oldContext.character.inventory
                    ? [...oldContext.character.inventory, item]
                    : [item],
            },
        };
    });
};

const removeItem = (setContext, item) => {
    setContext((oldContext) => {
        return {
            ...oldContext,
            character: {
                ...oldContext.character,
                inventory: oldContext.character.inventory.filter(
                    (i) => i != item
                ),
            },
        };
    });
};

export { changeGold, changeScore, changeStat, addItem, removeItem };
