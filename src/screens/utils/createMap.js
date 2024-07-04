export default function createMap(data, bindControls) {
    const container = document.getElementById("map");
    for (const [i, row] of data.entries()) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "row";

        for (const [j, cellData] of row.entries()) {
            const cellDiv = document.createElement("div");
            cellDiv.className = `cell ${cellData}`;
            if (cellData === "spawn") {
                cellDiv.classList.add("player");
            }
            if (cellData === "wall") {
                const north = data[i - 1] ? data[i - 1][j] : undefined;
                const south = data[i + 1] ? data[i + 1][j] : undefined;
                const west = row[j - 1];
                const east = row[j + 1];
                cellDiv.classList.add(wallClasses(north, south, west, east));
            }
            rowDiv.appendChild(cellDiv);
        }

        container.appendChild(rowDiv);
    }
    bindControls();
}

function wallClasses(north, south, west, east) {
    let classes = "";
    if (north === "wall") {
        classes += "north";
    }
    if (south === "wall") {
        classes += "south";
    }
    if (west === "wall") {
        classes += "west";
    }
    if (east === "wall") {
        classes += "east";
    }
    if (classes === "") {
        classes = "island";
    }
    return classes;
}
