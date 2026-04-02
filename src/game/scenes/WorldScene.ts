import * as Phaser from 'phaser';
import { WorldMapEntity } from '../entities/map';
import { PlayerWitch } from '../entities/player';
import { CameraSystem } from '../systems/camera';
import { CollisionSystem } from '../systems/collision';
import { TravelSystem, TravelFastSystem } from '../systems/travel';
import { InteractionSystem } from '../systems/Interaction';
import { DebugPanel } from '../ui';
import { DialogBox } from '../ui/dialog/DialogBox';

export class WorldScene extends Phaser.Scene {
  private worldMap!: WorldMapEntity;
  private spawnPoint!: string;
  private player!: PlayerWitch;
  private cameraSystem!: CameraSystem;
  private collisionSystem!: CollisionSystem;
  private travelSystem!: TravelSystem;
  private travelFastSystem!: TravelFastSystem;
  private interactionSystem!: InteractionSystem;
  private dialogBox!: DialogBox;
  private debugPanel: DebugPanel;

  constructor() {
    super({ key: 'WorldScene' });
    this.debugPanel = new DebugPanel();
  }

  init(data: { fromScene: string; spawnPoint: string }) {
    this.spawnPoint = data.spawnPoint;
  }

  create(): void {
    const spawn = this.getSpawnForPoint(this.spawnPoint);
    this.worldMap = new WorldMapEntity(this, 'map_world');
    this.player = new PlayerWitch(this, spawn.x, spawn.y);

    // collisionSytem é usado em mais de um sistema por isso é criado antes para ser compartilhado
    this.collisionSystem = new CollisionSystem(this);

    this.loadingIteractionSpecial();
    this.loadingCollision();
    this.loadingTravel();
    this.loadingTravelFast();
    this.loadingInteraction();

    this.dialogBox = new DialogBox();

    this.cameraSystem = new CameraSystem(this);
    this.cameraSystem.setupMainCamera(
      this.player.sprite,
      this.worldMap.width,
      this.worldMap.height,
    );
  }

  update(): void {
    this.player.update();

    const pos = this.player.getPosition();
    this.travelSystem.update(pos.x, pos.y);
    this.interactionSystem.update(pos.x, pos.y);
    this.travelFastSystem.update(pos.x, pos.y);
    this.debugPanel.setText(`pos x e y: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})`);
  }

  private getSpawnForPoint(pointId: string) {
    const spawnMap: Record<string, { x: number; y: number }> = {
      default: { x: 56, y: 150 },
      world_professor_to_world: { x: 610, y: 285 },
      hall_to_world: { x: 222, y: 270 },
      garden_to_world: { x: 225, y: 370 },
    };
    return spawnMap[pointId] ?? spawnMap['default'];
  }

  private loadingIteractionSpecial() {
    // sistema de interação que altera o sprite -> implementar
    this.collisionSystem.bindObjectLayer(this.worldMap.map, 'special', this.player.sprite);
  }

  private loadingCollision() {
    this.collisionSystem.bindObjectLayer(this.worldMap.map, 'colisor', this.player.sprite);
  }

  private loadingTravel() {
    // sistema de passagens com interação (ex: porta para casa)
    this.travelSystem = new TravelSystem(this);
    this.travelSystem.bindObjectLayer(this.worldMap.map, 'passager', this.player.sprite);
    const interactablesTravel = this.worldMap.map.getObjectLayer('passager')?.objects.map((obj) => ({
      id: 'door',
      x: (obj.x ?? 0) + (obj.width ?? 0) / 2,
      y: (obj.y ?? 0) + (obj.height ?? 0) / 2,
      scene: 'HouseScene',
    })) || [];
    this.travelSystem.registerInteractables(interactablesTravel);
  }

  private loadingTravelFast() {
    // sistema de passagens sem interação, apenas colisão para troca de cena
    this.travelFastSystem = new TravelFastSystem(this);
    this.travelFastSystem.bindObjectLayer(this.worldMap.map, 'travel', this.player.sprite);
    const interactablesTravelFast = this.worldMap.map.getObjectLayer('travel')?.objects.map((obj) => ({
      id: 'default',
      x: (obj.x ?? 0) + (obj.width ?? 0) / 2,
      y: (obj.y ?? 0) + (obj.height ?? 0) / 2,
      scene: 'WorldProfessorScene',
    })) || [];
    this.travelFastSystem.registerInteractables(interactablesTravelFast);
  }

  private loadingInteraction() {
    // carrega interações simples, como mensagens ao interagir com um objeto
    this.interactionSystem = new InteractionSystem(this);
    const interactablesInteraction = this.worldMap.map.getObjectLayer('special')?.objects.map((obj) => (
      {
      id: obj.id.toString(),
      x: (obj.x ?? 0) + (obj.width ?? 0) / 2,
      y: (obj.y ?? 0) + (obj.height ?? 0) / 2,
      message: 'Os desafios ainda não estão disponíveis, volte mais tarde!',
      }
    )) || [];
    this.interactionSystem.registerInteractables(interactablesInteraction);
  }

  shutdown(): void {
    this.collisionSystem?.destroy();
    this.travelSystem?.destroy();
    this.travelFastSystem?.destroy();
    this.interactionSystem?.destroy();
    this.player?.sprite?.destroy();
    this.debugPanel?.destroy();
  }

  destroy(): void {
    this.shutdown();
  }
}
