import * as Phaser from 'phaser';

export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Configuração do spritesheet do personagem
 *
 * Spritesheets: player.png e player_run.png
 * Tamanho: 136x144px (4x4 matrix = frames 34x36px)
 *
 * Linhas (direções):
 *   0: down (frente)
 *   1: left (esquerda)
 *   2: right (direita)
 *   3: up (costas)
 *
 * Colunas (estados):
 *   0: idle frame 1
 *   1: walk frame 1
 *   2: idle frame 2
 *   3: walk frame 2
 */
const PLAYER_FRAMES = {
  down: { row: 0, idle: [0, 2], walk: [0, 1, 2, 3] },
  left: { row: 1, idle: [4, 6], walk: [4, 5, 6, 7] },
  right: { row: 2, idle: [8, 10], walk: [8, 9, 10, 11] },
  up: { row: 3, idle: [12, 14], walk: [12, 13, 14, 15] },
};

/**
 * Entidade do jogador - personagem controlável
 */
export class PlayerBoy {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private currentDirection: Direction = 'down';
  private isMoving: boolean = false;
  private isRunning: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, initialDirection?: string) {
    // Criar sprite com física
    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setCollideWorldBounds(true);

    // Configurar hitbox (ajustado para o tamanho do sprite 34x36)
    this.sprite.body?.setSize(12, 10);
    this.sprite.body?.setOffset(10, 26);

    // Criar animações
    this.createAnimations(scene);

    // Iniciar com animação idle para baixo
    this.sprite.play(initialDirection || 'player-idle-down');
  }

  /**
   * Cria todas as animações do personagem (walk e run)
   */
  private createAnimations(scene: Phaser.Scene): void {
    const directions: Direction[] = ['down', 'left', 'right', 'up'];

    directions.forEach((dir) => {
      const config = PLAYER_FRAMES[dir];

      // Animação IDLE (parado) - usa spritesheet normal
      scene.anims.create({
        key: `player-idle-${dir}`,
        frames: config.idle.map((frame) => ({ key: 'player', frame })),
        frameRate: 2,
        repeat: -1,
      });

      // Animação WALK (andando) - usa spritesheet normal
      scene.anims.create({
        key: `player-walk-${dir}`,
        frames: config.walk.map((frame) => ({ key: 'player', frame })),
        frameRate: 8,
        repeat: -1,
      });

      // Animação RUN (correndo) - usa spritesheet de corrida
      scene.anims.create({
        key: `player-run-${dir}`,
        frames: config.walk.map((frame) => ({ key: 'player_run', frame })),
        frameRate: 12,
        repeat: -1,
      });
    });
  }

  /**
   * Define a direção atual do personagem
   */
  setDirection(direction: Direction): void {
    this.currentDirection = direction;
  }

  /**
   * Define se o personagem está correndo
   */
  setRunning(running: boolean): void {
    this.isRunning = running;
  }

  /**
   * Define a velocidade do personagem e atualiza animação
   */
  setVelocity(x: number, y: number): void {
    this.sprite.setVelocity(x, y);

    const wasMoving = this.isMoving;
    this.isMoving = x !== 0 || y !== 0;

    // Determinar qual animação usar
    let animKey: string;
    if (!this.isMoving) {
      animKey = `player-idle-${this.currentDirection}`;
    } else if (this.isRunning) {
      animKey = `player-run-${this.currentDirection}`;
    } else {
      animKey = `player-walk-${this.currentDirection}`;
    }

    // Atualizar animação se mudou
    if (this.sprite.anims.currentAnim?.key !== animKey) {
      this.sprite.play(animKey);
    }
  }

  /**
   * Retorna a direção atual
   */
  getDirection(): Direction {
    return this.currentDirection;
  }

  /**
   * Retorna a posição atual
   */
  getPosition(): { x: number; y: number } {
    return {
      x: this.sprite.x,
      y: this.sprite.y,
    };
  }

}
