import * as Phaser from 'phaser';
import { PlayerWitch } from '../entities/player';
import { CameraSystem } from '../systems/camera';
import { CollisionSystem } from '../systems/collision';
import { TravelFastSystem } from '../systems/travel';
import { DebugPanel, MessageBox } from '../ui';
import { WorldMapGardenEntity } from '../entities/map';
import { LIST_ITENS } from '../data/ItemsData';
import { DIALOG_CHALLENGE_GARDEN_RECIPE_01, DIALOG_CHALLENGE_GARDEN_RECIPE_02, RECIPES_LIST } from '../data/challenges';
import { DialogBox } from '../ui/dialog/DialogBox';


export class GardenScene extends Phaser.Scene {
  private gardenMap!: WorldMapGardenEntity;
  private spawnPoint!: string;
  private player!: PlayerWitch;
  private cameraSystem!: CameraSystem;
  private collisionSystem!: CollisionSystem;
  private travelFastSystem!: TravelFastSystem;
  private debugPanel: DebugPanel;
  private messageBox!: MessageBox;
  private itemSprites: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private itensColected: string[] = [];
  private dialogBox!: DialogBox;
  private dialogList!: any

  constructor() {
    super({ key: 'GardenScene' });
    this.debugPanel = new DebugPanel();
  }

  init(data: { fromScene: string; spawnPoint: string }) {
    this.spawnPoint = data.spawnPoint;
  }

  create(): void {
    this.dialogBox = new DialogBox();
    this.dialogBox.registerDialog(DIALOG_CHALLENGE_GARDEN_RECIPE_01);


    this.gardenMap = new WorldMapGardenEntity(this, 'map_garden');
    const spawn = this.getSpawnForPoint(this.spawnPoint);
    this.player = new PlayerWitch(this, spawn.x, spawn.y);

    this.collisionSystem = new CollisionSystem(this);
    this.loadingCollision();
    this.loadingTravelFast();
    this.loadingInteraction();


    this.cameraSystem = new CameraSystem(this);
    this.cameraSystem.setupMainCamera(
      this.player.sprite,
      this.gardenMap.width,
      this.gardenMap.height,
    );
  }

  private getSpawnForPoint(pointId: string) {
    const spawnMap: Record<string, { x: number; y: number }> = {
      default: { x: 160, y: 415 },
    };
    return spawnMap[pointId] ?? spawnMap.default;
  }

  update(): void {

    this.player.update();
    this.verifyInteraction();

    const pos = this.player.getPosition();
    this.travelFastSystem.update(pos.x, pos.y);

    this.debugPanel.setText(`pos x e y: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})`);
  }

  private loadingCollision() {
    this.collisionSystem.bindObjectLayer(this.gardenMap.map, 'colisor', this.player.sprite);
  }

  private loadingTravelFast() {
    this.travelFastSystem = new TravelFastSystem(this);
    this.travelFastSystem.bindObjectLayer(this.gardenMap.map, 'passage', this.player.sprite);
    const interactablesTravelFast = this.gardenMap.map.getObjectLayer('passage')?.objects.map((obj) => ({
      id: 'garden_to_world',
      x: (obj.x ?? 0) + (obj.width ?? 0) / 2,
      y: (obj.y ?? 0) + (obj.height ?? 0) / 2,
      scene: 'WorldScene',
    })) || [];
    this.travelFastSystem.registerInteractables(interactablesTravelFast);
  }

  private loadingInteraction() {
    LIST_ITENS.forEach((item) => {
      const x = this.randomPosition('x');
      const y = this.randomPosition('y');

      const sprite = this.add.sprite(x, y, item.key);
      this.physics.add.existing(sprite, true);
      this.itemSprites.set(item.key, sprite);
    });
  }

  private verifyInteraction(): void {
    if (!this.input.keyboard) return;
    if (!Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('X'))) return;

    const player = this.player.sprite;

    this.itemSprites.forEach((sprite, id) => {
      const distance = Phaser.Math.Distance.Between(
        player.x, player.y,
        sprite.x, sprite.y
      );

      if (distance <= 30) {
        this.collectItem(id, sprite);
      }
    });
  }

  private collectItem(id: string, sprite: Phaser.GameObjects.Sprite): void {
    if (this.itensColected.includes(id)) return;

    this.itensColected.push(id);
    sprite.destroy();
    this.itemSprites.delete(id);

    this.verifyCollection();
  }

  private verifyCollection(): void {
    const allCollected = this.currentRecipe()?.every((item) =>
      this.itensColected.includes(item)
   );

    if (allCollected) {
      this.itensColected = [];
      this.cleanInterectables();
      this.loadingInteraction();
      this.nextRecipe();

      if (this.currentRecipe() == null) {
        return this.dialogBox.show('Hm. Correto. Não fique animada, isso era o mínimo esperado. Pode voltar agora.', 'Morgava', '/assets/sprites/characters/morgava.png');
      }

      this.dialogBox.registerDialog(DIALOG_CHALLENGE_GARDEN_RECIPE_02);
    }
  }

  randomPosition(axis: 'x' | 'y'): number {
    const margin = 50;

    const mapDimension = axis === 'x' ? this.gardenMap.width : this.gardenMap.height;
    return Math.random() * (mapDimension - 2 * margin) + margin;
  }

  private cleanInterectables(): void {
    this.itemSprites.forEach((sprite) => sprite.destroy());
    this.itemSprites.clear();
  }

  currentRecipe(): string[] | null {
    return RECIPES_LIST[0]?.items || null;
  }

  nextRecipe(): void {
    RECIPES_LIST.shift();
  }

  shutdown(): void {
    this.cleanInterectables();
    this.collisionSystem?.destroy();
    this.travelFastSystem?.destroy();
    this.player?.sprite?.destroy();
    this.debugPanel?.destroy();
  }

  destroy(): void {
    this.shutdown();
  }
}
