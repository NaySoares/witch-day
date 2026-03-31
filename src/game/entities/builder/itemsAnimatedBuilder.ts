import * as Phaser from 'phaser';

interface ItemsAnimatedData {
  id: string;
  x: number;
  y: number;
  vel: number;
}

const HITBOX_CONFIG: Record<string, {
  main: { offsetX: number; offsetY: number; width: number; height: number };
}> = {
  broom: {
    main: { offsetX: 0, offsetY: -5, width: 10, height: 20 },
  },
};

const BROOM_ANIM_KEY = 'broom_fly';
const BROOM_FRAME_RATE = 8;
const BROOM_FRAME_COUNT = 4;
const BROOM_FRAME_WIDTH = 32;
const BROOM_FRAME_HEIGHT = 32;

export class ItemsAnimatedBuilder {
  private scene: Phaser.Scene;
  private broomSprites: Phaser.Physics.Arcade.Sprite[] = [];
  private mapWidth: number;

  constructor(scene: Phaser.Scene, mapWidth: number, mapHeight: number) {
    this.scene = scene;
    this.mapWidth = mapWidth;
    this.createBroomAnimation();
  }

  private createBroomAnimation(): void {
    // Evita recriar a animação se já existir
    if (this.scene.anims.exists(BROOM_ANIM_KEY)) return;

    this.scene.anims.create({
      key: BROOM_ANIM_KEY,
      frames: this.scene.anims.generateFrameNumbers('broom', {
        start: 0,
        end: BROOM_FRAME_COUNT - 1,
      }),
      frameRate: BROOM_FRAME_RATE,
      repeat: -1,
    });
  }

  createItems(items: ItemsAnimatedData[]): ItemsAnimatedData[] {
    const interactables: ItemsAnimatedData[] = [];

    items.forEach((item) => {
      this.createItem(item);
      if (item.id) {
        interactables.push({ id: item.id, x: item.x, y: item.y, vel: item.vel });
      }
    });

    return interactables;
  }

  getBroomSprites(): Phaser.Physics.Arcade.Sprite[] {
    return this.broomSprites;
  }

  private createItem(item: ItemsAnimatedData): void {
    const { x, y, vel } = item;
    const config = HITBOX_CONFIG['broom'].main;

    const sprite = this.scene.physics.add.sprite(x, y, 'broom');
    sprite.setOrigin(0.5, 1);
    sprite.play(BROOM_ANIM_KEY);

    // Hitbox via setSize/setOffset no próprio corpo do sprite
    sprite.setSize(config.width, config.height);
    sprite.setOffset(
      (BROOM_FRAME_WIDTH - config.width) / 2 + config.offsetX,
      (BROOM_FRAME_HEIGHT - config.height) / 2 - config.offsetY,
    );

    sprite.setVelocityX(vel);
    sprite.setFlipX(vel < 0);
    sprite.setCollideWorldBounds(true);
    sprite.setBounce(1, 0);
    sprite.setGravityY(-this.scene.physics.world.gravity.y); // cancela gravidade

    sprite.on('worldbounds', (_body: Phaser.Physics.Arcade.Body, blockingLeft: boolean) => {
      sprite.setFlipX(blockingLeft);
    });

    sprite.setDepth(y + config.offsetY + config.height / 2);

    this.broomSprites.push(sprite);
  }
}