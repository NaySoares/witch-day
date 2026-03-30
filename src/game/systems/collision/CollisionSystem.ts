import * as Phaser from 'phaser';

export class CollisionSystem {
  private colliderZones: Phaser.GameObjects.Zone[] = [];

  constructor(private readonly scene: Phaser.Scene) {}

  bindObjectLayer(
    map: Phaser.Tilemaps.Tilemap,
    layerName: string,
    target: Phaser.Physics.Arcade.Sprite,
  ): void {
    const colliderObjectLayer = map.getObjectLayer(layerName);
    if (!colliderObjectLayer) {
      return;
    }

    colliderObjectLayer.objects.forEach((objectData) => {
      if (!objectData.width || !objectData.height) {
        return;
      }

      const colliderZone = this.scene.add.zone(
        (objectData.x ?? 0) + objectData.width / 2,
        (objectData.y ?? 0) + objectData.height / 2,
        objectData.width,
        objectData.height,
      );

      this.scene.physics.add.existing(colliderZone, true);
      this.colliderZones.push(colliderZone);
      this.scene.physics.add.collider(target, colliderZone);
    });
  }

  destroy(): void {
    this.colliderZones.forEach((zone) => zone.destroy());
    this.colliderZones = [];
  }
}
