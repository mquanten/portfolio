# Manager
Controls a group of objects.

Recommended managers: 
- Options
	- Contains all player options such as controls, volume and whether the game is in fullscreen. `DontDestroyOnLoad`
-  UI 
	- Draws UI to the screen including Pause and Settings menu as well as in game dialogues and tooltips.
- HUD
	- Draws the player's HUD including things like health.
- Enemy
	- Controls the spawning and other stats of enemies such as how fast they fire etc. this script will especially be useful for scaling rooms later in the game.
- Stats
	- This manager should keep track of the players health, kills, deaths, pickups and other stats. It should also keep track of bosses defeated, abilities unlocked and items collected. `DontDestroyOnLoad`


# Controller
Controls one specific object.

# Helper
Makes the programmers job easier.

![](Screenshot%202022-06-06%20at%2002.47.54.png)