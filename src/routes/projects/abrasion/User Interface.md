---
title: User Interface
tags: ['abrasion']
layout: document
---
# HUD
## Health
The health will be stored as teeth, starting the game with 3 teeth. Upon taking a hit the tooth will crumble and fall out of the container, leaving an outline in its place. I have chosen this method over a health bar as it gives the player immediate feedback on how much damage they can take.

> [!QUESTION] Hiding when not in combat?
> Is this a good idea or is it better to have a constant view on your health even when enemies aren't around?

## Mirrors
Mirrors are a collectible currency and will be displayed as an integer with an icon next to them. This should be hidden unless you pick up some mirrors or are in a shop. I might remove the currency entirely and have abilities and upgrades be entirely discovery based. I can always add a currency based system to a different game, however I like the simplicity of a fully discovery driven upgrade system as opposed to creating grindy moments where the player has to save up for an item.

> [!QUESTION] Animated mirrors?
> Should the mirrors fly up towards the UI on pickup?

## Previews
Make sure that certain abilities or button presses contain previews which will show how the ability will play out, i.e. a visual indicator of where an item will be thrown.

## Tips
Tool tips should be worked into the world either via signs or in game objects that have hints of what the button could be or characters in the scene saying the tips.

---

# Map
The user will be able to press the <kbd>Select</kbd> or <kbd>Tab</kbd> button to bring up a map of the game, displaying sections they have previously visited. I considered adding a minmap in the top right similar to Hollow Knight however I prefer the more cinematic views with a very minimal user interface as seen in Ori, if playtesters would prefer a minimap and they find the game too hard to navigate without one I will add a minimap.

---

# Main Menu
The main menu should have a large title and a menu with minimal options:
	- Start Game
	- Options
	- Quit Game

> [!NOTE]
> Make sure all menu items on this and all other menus have nice spacing between each option.

---

# Pause Menu
The pause menu should darken the game screen, with a minimal centered container with rounded corners, this container should contain a title with the word Pause at the top of the game the options:
	- Resume Button
	- Save/Load
	- Settings
		- Resolution
		- Full Screen
		- Volume Mixer
		- Controls
	- Main Menu
	- Quit Game

> [!NOTE] Celeste's Pause Menu
> I like the simplicity of Celeste's pause menu and may actually consider removing the rounded container background of the pause menu. I will draft one with and one without.

---

# Fonts
What font should I use for the game? What kind of font would fit this game? A simple sans-serif font, most similar to Ori of the games on the Moodboard.

---

# Colors
What's a good color scheme for the design? Build the UI in noir colors first and then add a small amount of color to accent options.

Vibrant blues for accents. Possibly a gradient to a pink or purple for certain backgrounds (see Celeste stat screen).

---

# [[Moodboard]]