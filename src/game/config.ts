import * as Phaser from 'phaser';
import { PreloadScene, WorldScene, HouseScene } from './scenes';

const GAME_WIDTH_DEFAULT = 1920;
const GAME_HEIGHT_DEFAULT = 1080;

export const GAME_WIDTH = window.innerWidth;
export const GAME_HEIGHT = window.innerHeight;
export const TILE_SIZE = 16;

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH_DEFAULT,
  height: GAME_HEIGHT_DEFAULT,
  pixelArt: true,
  roundPixels: true,
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: process.env.NEXT_PUBLIC_ENV === 'development',
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game-container',
  },
  scene: [PreloadScene, WorldScene, HouseScene],
};
