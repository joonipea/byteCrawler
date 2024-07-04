import { generateMap } from "./generateMap";

export default function nextMap(
    contextRef,
    setNextFloor,
    setLoadingScreen,
    setContext
) {
    let contextCopy = contextRef.current;
    if (!contextCopy.maps[contextCopy.map.floor]) {
        generateMap(contextCopy.worldName, contextCopy.map.floor)
            .then((res) => res.json())
            .then((newFloor) => {
                setNextFloor(newFloor);
                setLoadingScreen([]);
            });
    } else {
        setContext((oldContext) => {
            return {
                ...oldContext,
                map: oldContext.maps[oldContext.map.floor],
            };
        });
        setLoadingScreen([]);
    }
}
