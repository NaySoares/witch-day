import * as Phaser from 'phaser';
import { HouseMapProfessorEntity } from '../entities/map';
import { PlayerWitch } from '../entities/player';
import { CameraSystem } from '../systems/camera';
import { CollisionSystem } from '../systems/collision';
import { TravelSystem } from '../systems/travel';
import { DebugPanel } from '../ui';

export class HouseProfessorScene extends Phaser.Scene {
  private spawnPoint!: string;
  private houseMapProfessor!: HouseMapProfessorEntity;
  private player!: PlayerWitch;
  private cameraSystem!: CameraSystem;
  private collisionSystem!: CollisionSystem;
  private travelSystem!: TravelSystem;
  private debugPanel: DebugPanel;

  constructor() {
    super({ key: 'HouseProfessorScene' });
    this.debugPanel = new DebugPanel();
  }

  init(data: { fromScene: string; spawnPoint: string }) {
    this.spawnPoint = data.spawnPoint;
  }

  create(): void {
    const spawn = this.getSpawnForPoint(this.spawnPoint);

    this.houseMapProfessor = new HouseMapProfessorEntity(this, 'map_house_professor');
    this.player = new PlayerWitch(this, spawn.x, spawn.y);

    this.collisionSystem = new CollisionSystem(this);
    this.collisionSystem.bindObjectLayer(this.houseMapProfessor.map, 'colisor', this.player.sprite);

    this.travelSystem = new TravelSystem(this);
    this.travelSystem.bindObjectLayer(this.houseMapProfessor.map, 'passager', this.player.sprite);
    const interactablesTravel = this.houseMapProfessor.map.getObjectLayer('passager')?.objects.map((obj) => ({
      id: 'house_professor_to_world_professor',
      x: (obj.x ?? 0) + (obj.width ?? 0) / 2,
      y: (obj.y ?? 0) + (obj.height ?? 0) / 2,
      scene: 'WorldProfessorScene',
    })) || [];
    this.travelSystem.registerInteractables(interactablesTravel);

    this.cameraSystem = new CameraSystem(this);
    this.cameraSystem.setupMainCamera(this.player.sprite, this.houseMapProfessor.width, this.houseMapProfessor.height);
  }

  private getSpawnForPoint(pointId: string) {
    const spawnMap: Record<string, { x: number; y: number }> = {
      default: { x: 50, y: 120 },
    };
    return spawnMap[pointId] ?? spawnMap.default;
  }

  update(): void {
    this.player.update();

    const pos = this.player.getPosition();
    this.travelSystem.update(pos.x, pos.y);

    this.debugPanel.setText(`pos x e y: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})`);
  }

  shutdown(): void {
    this.collisionSystem?.destroy();
    this.travelSystem?.destroy();
    this.player?.sprite?.destroy();
    this.debugPanel?.destroy();
  }

  destroy(): void {
    this.shutdown();
  }
}
