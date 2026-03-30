import * as Phaser from 'phaser';
import { ItemsData } from '../data/buildingsData';
import { InteractableData } from '../data/typesData';

/**
 * Configuração de hitbox
 */
const HITBOX_CONFIG: Record<string, {
  main: { offsetY: number; width: number; height: number };
}> = {
  pillar: {
    main: { offsetY: -70, width: 170, height: 70 },
  },
};

/**
 * Constrói itens interativos no mapa
 */
export class ItemsBuilder {
  private scene: Phaser.Scene;
  private obstacles: Phaser.Physics.Arcade.StaticGroup;

  constructor(scene: Phaser.Scene, obstacles: Phaser.Physics.Arcade.StaticGroup, mapWidth: number, mapHeight: number) {
    this.scene = scene;
    this.obstacles = obstacles;
  }

  createItems(items: ItemsData[]): InteractableData[] {
    const interactables: InteractableData[] = [];

    items.forEach((item) => {
      this.createItem(item);

      if (item.interactable) {
        interactables.push({
          id: item.interactable.id,
          x: item.x + item.interactable.offsetX,
          y: item.y + item.interactable.offsetY,
          message: item.interactable.message,
        });
      }
    });

    return interactables;
  }

  private createItem(item: ItemsData): void {
    const { x, y, type, centerWorldX } = item;
    const textureKey = type;

    const sprite = this.scene.add.image(x, y, textureKey);
    sprite.setOrigin(0.5, 1);

    const config = HITBOX_CONFIG[type];
    const mainHitbox = config.main;
    const hitboxCenterY = y + mainHitbox.offsetY;
    const bordaInferior = hitboxCenterY + mainHitbox.height / 2;
    sprite.setDepth(bordaInferior);

    this.createHitbox(x, hitboxCenterY, mainHitbox.width, mainHitbox.height);
  }

  private createHitbox(x: number, y: number, width: number, height: number): void {
    const hitbox = this.scene.add.zone(x, y, width, height);
    this.scene.physics.add.existing(hitbox, true);
    this.obstacles.add(hitbox);
  }
}
