# Managers
Manager scripts are a way to keep track of the state and flow of your game. It is worth having a few different ones to keep the code clean and allow you to track multiple things, I have included a few examples below that are worth having. 

- Start the game with these Managers as an overview of the game.
- Next hook up the player to all the scripts that are necessary.
- Create a map outline.
- Fill map with enemies, art and items.
- Create combat system.

## Options Manager
Store Player Settings and Options in here.

## TransitionManager
Handles Transitions from level to level.

## HUDManager
Draws Dialogue and Hints on the screen.

## UIManager
Opens the Pause Menu and transitions to Settings Menu.

## ProgressionManager
Tracks the players progress on bosses, abilities and items.

## EnemyManager
Spawns enemies in based on the script.

> [!NOTE] Keep these scripts running
> Add `DontDestroyOnLoad` which will leave the managers running from scene to scene.

> [!NOTE] Try this tool
> Allows you to select GameObjects from the scene using a pipette like in many art tools.


# Game Structure
## Heirarchy
Split up into these 5 categories.
### Managers
#### Game Manager
T
### Setup
Cameras, Lights and Event Systems.
### Enivornment
Tiles, Terrains, Trees etc. 
### Canvases
Any canvases.
### Systems
`DontDestoyOnLoad` objects.
