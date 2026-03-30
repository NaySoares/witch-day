import * as Phaser from 'phaser';
import { HouseMapEntity } from '../entities/map';
import { PlayerWitch } from '../entities/player';
import { CameraSystem } from '../systems/camera';
import { CollisionSystem } from '../systems/collision';
import { TravelSystem } from '../systems/travel';
import { PassagerSystem } from '../systems/passager';

export class HouseScene extends Phaser.Scene {
  private spawnPoint!: string;
  private houseMap!: HouseMapEntity;
  private player!: PlayerWitch;
  private cameraSystem!: CameraSystem;
  private collisionSystem!: CollisionSystem;
  private travelSystem!: TravelSystem;
  private passagerSystem!: PassagerSystem;

  constructor() {
    super({ key: 'HouseScene' });
  }

  init(data: { fromScene: string; spawnPoint: string }) {
    this.spawnPoint = data.spawnPoint;
  }

  create(): void {
    this.houseMap = new HouseMapEntity(this, 'map_house');

    const spawn = this.getSpawnForPoint(this.spawnPoint);
    this.player = new PlayerWitch(this, spawn.x, spawn.y);

    this.collisionSystem = new CollisionSystem(this);
    this.collisionSystem.bindObjectLayer(this.houseMap.map, 'colisor', this.player.sprite);

    this.passagerSystem = new PassagerSystem(this);
    this.passagerSystem.bindObjectLayer(this.houseMap.map, 'passager', this.player.sprite);
    const interactablesPassager = this.houseMap.map.getObjectLayer('passager')?.objects.map((obj) => ({
      id: obj.id.toString(),
      x: (obj.x ?? 0) + (obj.width ?? 0) / 2,
      y: (obj.y ?? 0) + (obj.height ?? 0) / 2,
      scene: 'WorldScene',
    })) || [];
    this.passagerSystem.registerInteractables(interactablesPassager);

    this.cameraSystem = new CameraSystem(this);
    this.cameraSystem.setupMainCamera(this.player.sprite, this.houseMap.width, this.houseMap.height);
  }

  private getSpawnForPoint(pointId: string) {
    const spawnMap: Record<string, { x: number; y: number }> = {
      door: { x: 80, y: 180 },
    };
    return spawnMap[pointId] ?? { x: 100, y: 150 };
  }

  update(): void {
    this.player.update();

    const pos = this.player.getPosition();
    this.passagerSystem.update(pos.x, pos.y);
  }

  shutdown(): void {
    this.collisionSystem?.destroy();
    this.travelSystem?.destroy();
    this.passagerSystem?.destroy();
    this.player?.sprite?.destroy();
  }

  destroy(): void {
    this.shutdown();
  }
}
