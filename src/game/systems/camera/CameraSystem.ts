import * as Phaser from 'phaser';
import { CAMERA_FOLLOW_LERP_X, CAMERA_FOLLOW_LERP_Y, CAMERA_ZOOM } from './CameraConfig';

export class CameraSystem {
  constructor(private readonly scene: Phaser.Scene) {}

  setupMainCamera(
    target: Phaser.GameObjects.GameObject,
    worldWidth: number,
    worldHeight: number,
  ): void {
    this.scene.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    const camera = this.scene.cameras.main;
    camera.setBounds(0, 0, worldWidth, worldHeight);
    camera.startFollow(target, true, CAMERA_FOLLOW_LERP_X, CAMERA_FOLLOW_LERP_Y);
    camera.setRoundPixels(true);
    camera.setZoom(CAMERA_ZOOM);
  }
}
