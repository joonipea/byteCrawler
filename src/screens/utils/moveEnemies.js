export default function moveEnemies(enemy) {
    const enemyClass =
        enemy.classList[enemy.classList.length - 1] != "player"
            ? enemy.classList[enemy.classList.length - 1]
            : enemy.classList[enemy.classList.length - 2];
    const enemyParent = enemy.parentElement;
    const enemyParentIndex = Array.from(
        enemyParent.parentElement.children
    ).indexOf(enemyParent);
    const enemyIndex = Array.from(enemyParent.children).indexOf(enemy);

    const player = document.querySelector(".player");
    const playerParent = player.parentElement;
    const playerParentIndex = Array.from(
        playerParent.parentElement.children
    ).indexOf(playerParent);
    const playerIndex = Array.from(playerParent.children).indexOf(player);

    if (
        Math.abs(enemyParentIndex - playerParentIndex) > 3 ||
        Math.abs(enemyIndex - playerIndex) > 3
    ) {
        return;
    }

    let nextCell;
    if (enemyIndex < playerIndex) {
        nextCell = enemy.nextElementSibling;
        if (
            nextCell.classList.length !== 2 ||
            nextCell.classList.contains("wall")
        ) {
            nextCell = undefined;
        }
    }
    if (!nextCell && enemyIndex > playerIndex) {
        nextCell = enemy.previousElementSibling;
        if (
            nextCell.classList.length !== 2 ||
            nextCell.classList.contains("wall")
        ) {
            nextCell = undefined;
        }
    }
    if (!nextCell && enemyParentIndex > playerParentIndex) {
        nextCell = enemyParent.previousElementSibling.children[enemyIndex];
        if (
            nextCell.classList.length !== 2 ||
            nextCell.classList.contains("wall")
        ) {
            nextCell = undefined;
        }
    }
    if (!nextCell && enemyParentIndex < playerParentIndex) {
        nextCell = enemyParent.nextElementSibling.children[enemyIndex];
        if (
            nextCell.classList.length !== 2 ||
            nextCell.classList.contains("wall")
        ) {
            nextCell = undefined;
        }
    }
    if (nextCell) {
        enemy.classList.remove(enemyClass);
        if (enemy.classList.length === 1) {
            enemy.classList.add("floor");
        }
        nextCell.classList.add(enemyClass);
    }
}
