# byteCrawler Game Design Doc

byteCrawler is a rougue-like dungeon crawler with procedural generation and deck building.

## Lighthouse

byteCrawler is split into 2 sections. Town building and dungeon crawling. The nature of dungeon crawling and town building is cyclical. The player finds pieces of the town in the dungeon. The pieces of the town then allow for upgrades and items for further crawling in the dungeon.

## Dungeon Crawling

Dungeons are procedurally generated. Everything is random. You can find the generation docs [here](https://github.com/joonipea/byteCrawler-server).

### Combat

When a player lands on a tile with a monster they have two choices fight or flee. Combat is turn based. Players have card spells to do damage or heal themselves during combat. Healing cards don't take away a players turn. The more damage a card does the higher the MP cost.

### Player Levels

Players level according to this formula:
`currentLevel ** 1.6 * playerRarity * 500`
Once a player reaches the the threshold, they're rewarded with 4 stat points and new spell cards to add to their deck.

### TO DO:

-   [ ] Bestiary
-   [ ] Wall Sprites
-   [ ] Potions as usable itimes

## Town Building

### Structures

#### Priest

Allows for the player to buy levels. TO DO: As the player goes further into the dungeon the cost decreases.

#### Merchant

Allows for the player to buy items that increase stats. As the player goes further into the dungeon better items become available.

#### To do: Quests

Allows for the player to accept quests and gain EXP through completion

#### Monolith

Allows for the player to check on their current progress in the dungeon.
