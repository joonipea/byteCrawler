export async function generateMap(name, floor) {
    return fetch(process.env.REACT_APP_MIDDLEWARE_URL + "/generateMap", {
        method: "GET",
        headers: {
            user: name,
            floor: floor,
        },
    });
}
