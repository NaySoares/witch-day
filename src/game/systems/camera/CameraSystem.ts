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
    camera.setZoom(CAMERA_ZOOM);

    // Tamanho efetivo da tela em unidades de mundo (considera o zoom)
    const effectiveScreenWidth = camera.width / CAMERA_ZOOM;
    const effectiveScreenHeight = camera.height / CAMERA_ZOOM;

    // Calcula offset para centralizar quando o mapa é menor que a tela
    const offsetX = worldWidth < effectiveScreenWidth
      ? Math.floor((effectiveScreenWidth - worldWidth) / 2)
      : 0;
    const offsetY = worldHeight < effectiveScreenHeight
      ? Math.floor((effectiveScreenHeight - worldHeight) / 2)
      : 0;

    // define os limites
    const boundsWidth = Math.max(worldWidth, effectiveScreenWidth);
    const boundsHeight = Math.max(worldHeight, effectiveScreenHeight);
    camera.setBounds(-offsetX, -offsetY, boundsWidth, boundsHeight);

    camera.startFollow(target, true, CAMERA_FOLLOW_LERP_X, CAMERA_FOLLOW_LERP_Y);
    camera.setRoundPixels(true);
  }
}