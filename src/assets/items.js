const items = {
    0: {
        "Rabbit's Foot": {
            description: "A lucky charm. Increases luck by 1.",
            price: Math.floor(Math.random() * 25) + 25,
            params: {
                luck: 1,
            },
        },
        "Wooden Sword": {
            description: "A wooden sword. Increases attack by 1.",
            price: Math.floor(Math.random() * 25) + 25,
            params: {
                attack: 1,
            },
        },
        "Wooden Shield": {
            description: "A wooden shield. Increases defense by 1.",
            price: Math.floor(Math.random() * 25) + 25,
            params: {
                defense: 1,
            },
        },
        "Torch": {
            description: "A Torch. Let's you see further in the dark.",
            price: Math.floor(Math.random() * 100) + 75,
        },
    },
    1: {
        "Rabbit's Foot": {
            description: "A lucky charm. Increases luck by 1.",
            price: Math.floor(Math.random() * 25) + 25,
            params: {
                luck: 1,
            },
        },
        "Wooden Sword": {
            description: "A wooden sword. Increases attack by 1.",
            price: Math.floor(Math.random() * 25) + 25,
            params: {
                attack: 1,
            },
        },
        "Wooden Shield": {
            description: "A wooden shield. Increases defense by 1.",
            price: Math.floor(Math.random() * 25) + 25,
            params: {
                defense: 1,
            },
        },
        "Rusty Armor": {
            description: "Rusty armor. Increases defense by 2.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 2,
            },
        },
        "Phoenix Plume": {
            description: "A phoenix plume. Allows you to revive once.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Cracked Wise Glasses": {
            description: "Wise glasses. Let's you learn more from encounters.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Oil Lamp": {
            description: "An oil lamp. Let's you see further in the dark.",
            price: Math.floor(Math.random() * 100) + 75,
        },
    },
    2: {
        "Rabbit's Foot": {
            description: "A lucky charm. Increases luck by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 1,
            },
        },
        "Rusty Sword": {
            description: "A rusty sword. Increases attack by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 1,
            },
        },
        "Rusty Shield": {
            description: "A rusty shield. Increases defense by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 1,
            },
        },
        "Rusty Armor": {
            description: "Rusty armor. Increases defense by 2.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 2,
            },
        },
        "Phoenix Plume": {
            description: "A phoenix plume. Allows you to revive once.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Cracked Wise Glasses": {
            description: "Wise glasses. Let's you learn more from encounters.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Oil Lamp": {
            description: "An oil lamp. Let's you see further in the dark.",
            price: Math.floor(Math.random() * 100) + 75,
        },
    },
    3: {
        "Rabbit's Foot": {
            description: "A lucky charm. Increases luck by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 1,
            },
        },
        "Rusty Sword": {
            description: "A rusty sword. Increases attack by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 1,
            },
        },
        "Rusty Shield": {
            description: "A rusty shield. Increases defense by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 1,
            },
        },
        "Rusty Armor": {
            description: "Rusty armor. Increases defense by 2.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 2,
            },
        },
        "Phoenix Plume": {
            description: "A phoenix plume. Allows you to revive once.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Cracked Wise Glasses": {
            description: "Wise glasses. Let's you learn more from encounters.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Oil Lamp": {
            description: "An oil lamp. Let's you see further in the dark.",
            price: Math.floor(Math.random() * 100) + 75,
        },
    },
    4: {
        "Rabbit's Foot": {
            description: "A lucky charm. Increases luck by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 1,
            },
        },
        "Rusty Sword": {
            description: "A rusty sword. Increases attack by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 1,
            },
        },
        "Rusty Shield": {
            description: "A rusty shield. Increases defense by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 1,
            },
        },
        "Rusty Armor": {
            description: "Rusty armor. Increases defense by 2.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 2,
            },
        },
        "Phoenix Plume": {
            description: "A phoenix plume. Allows you to revive once.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Cracked Wise Glasses": {
            description: "Wise glasses. Let's you learn more from encounters.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Oil Lamp": {
            description: "An oil lamp. Let's you see further in the dark.",
            price: Math.floor(Math.random() * 100) + 75,
        },
    },
    5: {
        "Rabbit's Foot": {
            description: "A lucky charm. Increases luck by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 1,
            },
        },
        "Rusty Sword": {
            description: "A rusty sword. Increases attack by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 1,
            },
        },
        "Rusty Shield": {
            description: "A rusty shield. Increases defense by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 1,
            },
        },
        "Rusty Armor": {
            description: "Rusty armor. Increases defense by 2.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 2,
            },
        },
        "Phoenix Plume": {
            description: "A phoenix plume. Allows you to revive once.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Cracked Wise Glasses": {
            description: "Wise glasses. Let's you learn more from encounters.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Oil Lamp": {
            description: "An oil lamp. Let's you see further in the dark.",
            price: Math.floor(Math.random() * 100) + 75,
        },
    },
    6: {
        "Rabbit's Foot": {
            description: "A lucky charm. Increases luck by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 1,
            },
        },
        "Rusty Sword": {
            description: "A rusty sword. Increases attack by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 1,
            },
        },
        "Rusty Shield": {
            description: "A rusty shield. Increases defense by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 1,
            },
        },
        "Rusty Armor": {
            description: "Rusty armor. Increases defense by 2.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 2,
            },
        },
        "Phoenix Plume": {
            description: "A phoenix plume. Allows you to revive once.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Cracked Wise Glasses": {
            description: "Wise glasses. Let's you learn more from encounters.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Oil Lamp": {
            description: "An oil lamp. Let's you see further in the dark.",
            price: Math.floor(Math.random() * 100) + 75,
        },
    },
    7: {
        "Rabbit's Foot": {
            description: "A lucky charm. Increases luck by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 1,
            },
        },
        "Rusty Sword": {
            description: "A rusty sword. Increases attack by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 1,
            },
        },
        "Rusty Shield": {
            description: "A rusty shield. Increases defense by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 1,
            },
        },
        "Rusty Armor": {
            description: "Rusty armor. Increases defense by 2.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 2,
            },
        },
        "Phoenix Plume": {
            description: "A phoenix plume. Allows you to revive once.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Cracked Wise Glasses": {
            description: "Wise glasses. Let's you learn more from encounters.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Oil Lamp": {
            description: "An oil lamp. Let's you see further in the dark.",
            price: Math.floor(Math.random() * 100) + 75,
        },
    },
    8: {
        "Rabbit's Foot": {
            description: "A lucky charm. Increases luck by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 1,
            },
        },
        "Rusty Sword": {
            description: "A rusty sword. Increases attack by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 1,
            },
        },
        "Rusty Shield": {
            description: "A rusty shield. Increases defense by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 1,
            },
        },
        "Rusty Armor": {
            description: "Rusty armor. Increases defense by 2.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 2,
            },
        },
        "Phoenix Plume": {
            description: "A phoenix plume. Allows you to revive once.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Cracked Wise Glasses": {
            description: "Wise glasses. Let's you learn more from encounters.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Oil Lamp": {
            description: "An oil lamp. Let's you see further in the dark.",
            price: Math.floor(Math.random() * 100) + 75,
        },
    },
    9: {
        "Rabbit's Foot": {
            description: "A lucky charm. Increases luck by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 1,
            },
        },
        "Rusty Sword": {
            description: "A rusty sword. Increases attack by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 1,
            },
        },
        "Rusty Shield": {
            description: "A rusty shield. Increases defense by 1.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 1,
            },
        },
        "Rusty Armor": {
            description: "Rusty armor. Increases defense by 2.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 2,
            },
        },
        "Phoenix Plume": {
            description: "A phoenix plume. Allows you to revive once.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Cracked Wise Glasses": {
            description: "Wise glasses. Let's you learn more from encounters.",
            price: Math.floor(Math.random() * 100) + 75,
        },
        "Oil Lamp": {
            description: "An oil lamp. Let's you see further in the dark.",
            price: Math.floor(Math.random() * 100) + 75,
        },
    },
}