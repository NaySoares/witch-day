import * as Phaser from 'phaser';
import { PlayerWitch } from '../entities/player';
import { CameraSystem } from '../systems/camera';
import { CollisionSystem } from '../systems/collision';
import { TravelFastSystem } from '../systems/travel';
import { DebugPanel, MessageBox } from '../ui';
import { HallMapEntity } from '../entities/map/HallMapEntity';
import { BROOM_DATA } from '../data/ItemsData';
import { ItemsAnimatedBuilder } from '../entities/builder/itemsAnimatedBuilder';
import { DIALOG_CHALLENGE_BROOM } from '../data/challenges';
import { DialogBox } from '../ui/DialogBox';

export class HallScene extends Phaser.Scene {
  private hallMap!: HallMapEntity;
  private spawnPoint!: string;
  private player!: PlayerWitch;
  private cameraSystem!: CameraSystem;
  private collisionSystem!: CollisionSystem;
  private travelFastSystem!: TravelFastSystem;
  private debugPanel: DebugPanel;
  private itemsBuilder!: ItemsAnimatedBuilder;
  private messageBox!: MessageBox;
  private dialogBox!: DialogBox;

  constructor() {
    super({ key: 'HallScene' });
    this.debugPanel = new DebugPanel();
    this.messageBox = new MessageBox();

  }

  init(data: { fromScene: string; spawnPoint: string }) {
    this.spawnPoint = data.spawnPoint;
  }

  create(): void {
    this.dialogBox = new DialogBox();
    this.dialogBox.registerDialog(DIALOG_CHALLENGE_BROOM);

    this.hallMap = new HallMapEntity(this, 'map_hall');
    const spawn = this.getSpawnForPoint(this.spawnPoint);
    this.player = new PlayerWitch(this, spawn.x, spawn.y);

    this.collisionSystem = new CollisionSystem(this);
    this.loadingCollision();
    this.loadingTravelFast();

    this.loadItems();

    this.cameraSystem = new CameraSystem(this);
    this.cameraSystem.setupMainCamera(
      this.player.sprite,
      this.hallMap.width,
      this.hallMap.height,
    );
  }

  private getSpawnForPoint(pointId: string) {
    const spawnMap: Record<string, { x: number; y: number }> = {
      default: { x: 80, y: 400 },
    };
    return spawnMap[pointId] ?? spawnMap.default;
  }

  update(): void {

    this.player.update();

    const pos = this.player.getPosition();
    this.travelFastSystem.update(pos.x, pos.y);

    this.debugPanel.setText(`pos x e y: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})`);
  }

  private loadingCollision() {
    this.collisionSystem.bindObjectLayer(this.hallMap.map, 'colisor', this.player.sprite);
  }

  private loadItems() {
    this.itemsBuilder = new ItemsAnimatedBuilder(this, this.hallMap.width, this.hallMap.height);
    this.itemsBuilder.createItems(BROOM_DATA);

    const broomSprites = this.itemsBuilder.getBroomSprites();

    this.physics.add.overlap(
      this.player.sprite,
      broomSprites,
      () => {
        this.messageBox.show('Colidiu com vassoura!');
      }
    );
  }

  private loadingTravelFast() {
    this.travelFastSystem = new TravelFastSystem(this);
    this.travelFastSystem.bindObjectLayer(this.hallMap.map, 'travel', this.player.sprite);
    const interactablesTravelFast = this.hallMap.map.getObjectLayer('passage')?.objects.map((obj) => ({
      id: 'hall_to_world',
      x: (obj.x ?? 0) + (obj.width ?? 0) / 2,
      y: (obj.y ?? 0) + (obj.height ?? 0) / 2,
      scene: 'WorldScene',
    })) || [];
    this.travelFastSystem.registerInteractables(interactablesTravelFast);
  }

  shutdown(): void {
    this.collisionSystem?.destroy();
    this.travelFastSystem?.destroy();
    this.player?.sprite?.destroy();
    this.debugPanel?.destroy();
    this.messageBox?.destroy();
  }

  destroy(): void {
    this.shutdown();
  }
}
