const cacheItem = (setContext, item) => {
    setContext((oldContext) => {
        return {
            ...oldContext,
            codex: {
                ...oldContext.codex,
                [item.id]: item,
            },
        };
    });
};

const cacheMob = (setContext, mob) => {
    setContext((oldContext) => {
        return {
            ...oldContext,
            bestiary: {
                ...oldContext.codex,
                [mob.name]: mob,
            },
        };
    });
};

export { cacheItem, cacheMob };
