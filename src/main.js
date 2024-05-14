// Kevin Tan
// Created: 5/6/2024
// Phaser: 3.70.0
//
// Shmungeon
//
// A gallery shooter
// 
// Art assets from Kenny Assets:
// UI
//   https://kenney.nl/assets/ui-pack-rpg-expansion
//   https://kenney.nl/assets/1-bit-input-prompts-pixel-16
// Tiles & Sprites
//   https://kenney.nl/assets/tiny-dungeon
// SFX
//   https://kenney.nl/assets/impact-sounds

// debug with extreme prejudice
"use strict"

/* TODO: 
1) spike collisions & health - stretch
2) shooting ==DONE==
3) enemy collisions & interactions
4) enemy pathing
5) wave formations
6) start screen - stretch
7) end screen - stretch
*/ 

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {pixelArt: true},  // prevent pixel art from getting blurred when scaled
    fps: { forceSetTimeOut: true, target: 60 },   // ensure consistent timing across machines
    width: 960,         // map is 20x50 tiles, each 16 pixels, scaled 3x; camera is 960x2400
    height: 600,        // accounting for camera size, this should be different
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [LevelOne, LevelTwo]
}

const game = new Phaser.Game(config);