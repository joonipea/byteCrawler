const ITEMS = {
    0: {
        Charm: {
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
        Torch: {
            description: "A Torch. Let's you see further in the dark.",
            price: Math.floor(Math.random() * 100) + 75,
        },
    },
    1: {
        Charm: {
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
        Wand: {
            description: "A magic wand. Increases luck by 2.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 2,
            },
        },
        "Iron Sword": {
            description: "An iron sword. Increases attack by 2.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 2,
            },
        },
        "Iron Shield": {
            description: "A iron shield. Increases defense by 2.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 2,
            },
        },
        "Iron Armor": {
            description: "Rusty armor. Increases defense by 4.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 4,
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
        Wand: {
            description: "A magic wand. Increases luck by 2.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 2,
            },
        },
        "Iron Sword": {
            description: "An iron sword. Increases attack by 2.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 2,
            },
        },
        "Iron Shield": {
            description: "A iron shield. Increases defense by 2.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 2,
            },
        },
        "Iron Armor": {
            description: "Rusty armor. Increases defense by 4.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 4,
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
        Staff: {
            description: "A magic staff. Increases luck by 3.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 3,
            },
        },
        "Steel Sword": {
            description: "A steel sword. Increases attack by 3.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 3,
            },
        },
        "Steel Shield": {
            description: "A steel shield. Increases defense by 3.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 3,
            },
        },
        "Steel Armor": {
            description: "Rusty armor. Increases defense by 6.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 6,
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
        Staff: {
            description: "A magic staff. Increases luck by 3.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 3,
            },
        },
        "Steel Sword": {
            description: "A steel sword. Increases attack by 3.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 3,
            },
        },
        "Steel Shield": {
            description: "A steel shield. Increases defense by 3.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 3,
            },
        },
        "Steel Armor": {
            description: "Rusty armor. Increases defense by 6.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 6,
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
        Staff: {
            description: "A magic staff. Increases luck by 3.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 3,
            },
        },
        "Steel Sword": {
            description: "A steel sword. Increases attack by 3.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 3,
            },
        },
        "Steel Shield": {
            description: "A steel shield. Increases defense by 3.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 3,
            },
        },
        "Steel Armor": {
            description: "Steel armor. Increases defense by 6.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 6,
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
        Grimoire: {
            description: "A magic staff. Increases luck by 4.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 4,
            },
        },
        "Silver Sword": {
            description: "A silver sword. Increases attack by 4.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 4,
            },
        },
        "Silver Shield": {
            description: "A silver shield. Increases defense by 3.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 4,
            },
        },
        "Silver Armor": {
            description: "Silver armor. Increases defense by 8.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 8,
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
        Grimoire: {
            description: "A magic staff. Increases luck by 4.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 4,
            },
        },
        "Silver Sword": {
            description: "A silver sword. Increases attack by 4.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 4,
            },
        },
        "Silver Shield": {
            description: "A silver shield. Increases defense by 4.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 4,
            },
        },
        "Silver Armor": {
            description: "Silver armor. Increases defense by 8.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 8,
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
        Grimoire: {
            description: "A magic staff. Increases luck by 4.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                luck: 4,
            },
        },
        "Silver Sword": {
            description: "A silver sword. Increases attack by 4.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                attack: 4,
            },
        },
        "Silver Shield": {
            description: "A silver shield. Increases defense by 4.",
            price: Math.floor(Math.random() * 50) + 75,
            params: {
                defense: 4,
            },
        },
        "Silver Armor": {
            description: "Silver armor. Increases defense by 8.",
            price: Math.floor(Math.random() * 50) + 125,
            params: {
                defense: 8,
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
};

export default ITEMS;
