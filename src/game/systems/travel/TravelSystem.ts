import * as Phaser from 'phaser';

export class TravelSystem {
  private travelZones: Phaser.GameObjects.Zone[] = [];

  constructor(private readonly scene: Phaser.Scene) {}

  bindObjectLayer(
    map: Phaser.Tilemaps.Tilemap,
    layerName: string,
    target: Phaser.Physics.Arcade.Sprite,
  ): void {
    const travelObjectLayer = map.getObjectLayer(layerName);
    if (!travelObjectLayer) {
      return;
    }

    travelObjectLayer.objects.forEach((objectData) => {
      if (!objectData.width || !objectData.height) {
        return;
      }

      const travelZone = this.scene.add.zone(
        (objectData.x ?? 0) + objectData.width / 2,
        (objectData.y ?? 0) + objectData.height / 2,
        objectData.width,
        objectData.height,
      );

      this.scene.physics.add.existing(travelZone, true);
      this.travelZones.push(travelZone);
      this.scene.physics.add.collider(target, travelZone);
    });
  }

  destroy(): void {
    this.travelZones.forEach((zone) => zone.destroy());
    this.travelZones = [];
  }
}
