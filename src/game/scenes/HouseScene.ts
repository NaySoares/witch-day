import * as Phaser from 'phaser';
import { HouseMapEntity } from '../entities/map';
import { PlayerWitch } from '../entities/player';
import { CameraSystem } from '../systems/camera';
import { CollisionSystem } from '../systems/collision';
import { TravelSystem } from '../systems/travel';

export class HouseScene extends Phaser.Scene {
  private spawnPoint!: string;
  private houseMap!: HouseMapEntity;
  private player!: PlayerWitch;
  private cameraSystem!: CameraSystem;
  private collisionSystem!: CollisionSystem;
  private travelSystem!: TravelSystem;

  constructor() {
    super({ key: 'HouseScene' });
  }

  init(data: { fromScene: string; spawnPoint: string }) {
    this.spawnPoint = data.spawnPoint;
  }

  create(): void {
    const spawn = this.getSpawnForPoint(this.spawnPoint);
    this.houseMap = new HouseMapEntity(this, 'map_house');
    this.player = new PlayerWitch(this, spawn.x, spawn.y);

    this.loadingCollision();
    this.loadingTravel();
    this.loadingInteraction();
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
    this.travelSystem.update(pos.x, pos.y);
  }

  private loadingInteraction() {
      // carrega interações simples, como mensagens ao interagir com um objeto
    }

  private loadingCollision() {
    this.collisionSystem = new CollisionSystem(this);
    this.collisionSystem.bindObjectLayer(this.houseMap.map, 'colisor', this.player.sprite);
  }


  private loadingTravel() {
    // sistema de passagens com interação (ex: porta para casa)
    this.travelSystem = new TravelSystem(this);
    this.travelSystem.bindObjectLayer(this.houseMap.map, 'passager', this.player.sprite);
    const interactablesTravel = this.houseMap.map.getObjectLayer('passager')?.objects.map((obj) => ({
      id: obj.id.toString(),
      x: (obj.x ?? 0) + (obj.width ?? 0) / 2,
      y: (obj.y ?? 0) + (obj.height ?? 0) / 2,
      scene: 'WorldScene',
    })) || [];
    this.travelSystem.registerInteractables(interactablesTravel);

    this.cameraSystem = new CameraSystem(this);
    this.cameraSystem.setupMainCamera(this.player.sprite, this.houseMap.width, this.houseMap.height);
  }


  shutdown(): void {
    this.collisionSystem?.destroy();
    this.travelSystem?.destroy();
    this.player?.sprite?.destroy();
  }

  destroy(): void {
    this.shutdown();
  }
}
