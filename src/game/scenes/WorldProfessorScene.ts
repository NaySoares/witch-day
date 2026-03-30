import * as Phaser from 'phaser';
import { WorldMapEntity } from '../entities/map';
import { PlayerWitch } from '../entities/player';
import { CameraSystem } from '../systems/camera';
import { CollisionSystem } from '../systems/collision';
import { TravelSystem } from '../systems/travel';
import { PassagerSystem } from '../systems/passager';
import { InteractionSystem } from '../systems/Interaction';

export class WorldProfessorScene extends Phaser.Scene {
  private worldMap!: WorldMapEntity;
  private player!: PlayerWitch;
  private cameraSystem!: CameraSystem;
  private collisionSystem!: CollisionSystem;
  private travelSystem!: TravelSystem;
  private passagerSystem!: PassagerSystem;
  private interactionSystem!: InteractionSystem;
  constructor() {
    super({ key: 'WorldProfessorScene' });
  }

  create(): void {
    this.worldMap = new WorldMapEntity(this, 'map_world');

    this.player = new PlayerWitch(this, 160, 150);

    this.collisionSystem = new CollisionSystem(this);
    this.collisionSystem.bindObjectLayer(this.worldMap.map, 'colisor', this.player.sprite);
    // sistema de interação que altera o sprite -> implementar
    this.collisionSystem.bindObjectLayer(this.worldMap.map, 'special', this.player.sprite);

    // sistema de viagens sem interação, apenas colisão para troca de cena
    this.travelSystem = new TravelSystem(this);
    this.travelSystem.bindObjectLayer(this.worldMap.map, 'travel', this.player.sprite);

    // sistema de passagens com interação (ex: porta para casa)
    this.passagerSystem = new PassagerSystem(this);
    this.passagerSystem.bindObjectLayer(this.worldMap.map, 'passager', this.player.sprite);
    const interactablesPassager = this.worldMap.map.getObjectLayer('passager')?.objects.map((obj) => ({
      id: 'door',
      x: (obj.x ?? 0) + (obj.width ?? 0) / 2,
      y: (obj.y ?? 0) + (obj.height ?? 0) / 2,
      scene: 'HouseScene',
    })) || [];
    this.passagerSystem.registerInteractables(interactablesPassager);

    this.interactionSystem = new InteractionSystem(this);
    const interactablesInteraction = this.worldMap.map.getObjectLayer('special')?.objects.map((obj) => ({
      id: obj.id.toString(),
      x: (obj.x ?? 0) + (obj.width ?? 0) / 2,
      y: (obj.y ?? 0) + (obj.height ?? 0) / 2,
      message: 'Os desafios ainda não estão disponíveis, volte mais tarde!',
    })) || [];
    this.interactionSystem.registerInteractables(interactablesInteraction);



    this.cameraSystem = new CameraSystem(this);
    this.cameraSystem.setupMainCamera(this.player.sprite, this.worldMap.width, this.worldMap.height);
  }

  update(): void {
    this.player.update();

    const pos = this.player.getPosition();
    this.passagerSystem.update(pos.x, pos.y);
    this.interactionSystem.update(pos.x, pos.y);
  }

  shutdown(): void {
    this.collisionSystem?.destroy();
    this.travelSystem?.destroy();
    this.passagerSystem?.destroy();
    this.interactionSystem?.destroy();
    this.player?.sprite?.destroy();
  }

  destroy(): void {
    this.shutdown();
  }
}
