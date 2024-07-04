export function spotlight(map, player, circleRadius) {
    const mapBounds = map.getBoundingClientRect();
    const playerBounds = player.getBoundingClientRect();
    const playerCenter = {
        x: playerBounds.x - mapBounds.x + playerBounds.width / 2,
        y: playerBounds.y - mapBounds.y + playerBounds.height / 2,
    };
    map.style.clipPath = `circle(calc(75 / 21 * ${circleRadius}lvmin * 2 - 2px) at ${playerCenter.x}px ${playerCenter.y}px)`;
    map.style.transformOrigin = `${playerCenter.x}px ${playerCenter.y}px`;
}

export function getCirlceRadius(inventory) {
    if (!inventory) return 3;
    if (inventory.includes("Oil Lamp")) return 5;
    if (inventory.includes("Torch")) return 4;
    return 3;
}
