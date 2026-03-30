import * as Phaser from 'phaser';

export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Configuração do spritesheet da bruxinha
 *
 * Linhas (direção):
 *   0: down (frente)
 *   1: left (esquerda)
 *   2: right (direita)
 *   3: up (costas)
 */

const PLAYER_WITCH_FRAMES = {
  down: { row: 0, frames: [0, 1, 2, 3] },
  left: { row: 1, frames: [0, 1, 2, 3] },
  right: { row: 2, frames: [0, 1, 2, 3] },
  up: { row: 3, frames: [0, 1, 2, 3] },
};

const PLAYER_WITCH_FRAMES_WALK = {
  down: { row: 0, frames: [0, 1, 2, 3, 4, 5] },
  left: { row: 1, frames: [0, 1, 2, 3, 4, 5] },
  right: { row: 2, frames: [0, 1, 2, 3, 4, 5] },
  up: { row: 3, frames: [0, 1, 2, 3, 4, 5] },
};

// se estiver em UP ou DOWN mapeia pra LEFT ou RIGHT respectivamente
const PLAYER_WITCH_FRAMES_DIE = {
  down: { row: 1, frames: [0, 1, 2, 3, 4, 5] },
  left: { row: 0, frames: [0, 1, 2, 3, 4, 5] },
  right: { row: 1, frames: [0, 1, 2, 3, 4, 5] },
  up: { row: 0, frames: [0, 1, 2, 3, 4, 5] },
};


const WALK_SPEED = 100;
const RUN_SPEED = 180;

/**
 * Entidade do jogador - personagem controlável
 */
export class PlayerWitch {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private currentDirection: Direction = 'down';
  private isMoving: boolean = false;
  private isRunning: boolean = false;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;


  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Criar sprite com física
    this.sprite = scene.physics.add.sprite(x, y, 'player_witch');
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setCollideWorldBounds(true);

    // Configurar hitbox
    this.sprite.body?.setSize(12, 10);
    this.sprite.body?.setOffset(7, 20);

    // Criar animações
    this.createAnimations(scene);
    // Iniciar com animação idle para baixo
    this.sprite.play('player-witch-idle-down');

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setAllowDrag(false);
    body.setDrag(0, 0);
    body.setAcceleration(0, 0);
    body.setMaxVelocity(RUN_SPEED, RUN_SPEED);

    if (!scene.input.keyboard) {
      throw new Error('Teclado nao disponivel para criar controles do jogador.');
    }

    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update(): void {
    this.isMove();
  }

  private isMove(): void {
    let inputX = 0;
    let inputY = 0;

    if (this.cursors.left?.isDown) {
      inputX = -1;
      this.setDirection('left');
    } else if (this.cursors.right?.isDown) {
      inputX = 1;
      this.setDirection('right');
    }

    if (this.cursors.up?.isDown) {
      inputY = -1;
      this.setDirection('up');
    } else if (this.cursors.down?.isDown) {
      inputY = 1;
      this.setDirection('down');
    }

    const hasMovementInput = inputX !== 0 || inputY !== 0;
    const isRunning = hasMovementInput && !!this.cursors.shift?.isDown;
    this.setRunning(isRunning);

    const currentSpeed = isRunning ? RUN_SPEED : WALK_SPEED;

    const velocity = new Phaser.Math.Vector2(inputX, inputY)
      .normalize()
      .scale(currentSpeed);

    this.setVelocity(velocity.x, velocity.y);
    this.sprite.setDepth(this.sprite.y);
  }


  /**
   * Cria todas as animações do personagem
   */
  private createAnimations(scene: Phaser.Scene): void {
    const directions: Direction[] = ['down', 'left', 'right', 'up'];
    const idleColumns = 4;
    const walkColumns = 6;
    const dieColumns = 6;

    directions.forEach((dir) => {
      const idleConfig = PLAYER_WITCH_FRAMES[dir];
      const walkConfig = PLAYER_WITCH_FRAMES_WALK[dir];
      const dieConfig = PLAYER_WITCH_FRAMES_DIE[dir];

      const idleKey = `player-witch-idle-${dir}`;
      if (scene.anims.exists(idleKey)) {
        scene.anims.remove(idleKey);
      }
      scene.anims.create({
        key: idleKey,
        frames: idleConfig.frames.map((frame: number) => ({
          key: 'player_witch',
          frame: idleConfig.row * idleColumns + frame,
        })),
        frameRate: 8,
        repeat: -1,
      });

      // Animação walk
      const walkKey = `player-witch-walk-${dir}`;
      if (scene.anims.exists(walkKey)) {
        scene.anims.remove(walkKey);
      }
      scene.anims.create({
        key: walkKey,
        frames: walkConfig.frames.map((frame: number) => ({
          key: 'player_witch_walk',
          frame: walkConfig.row * walkColumns + frame,
        })),
        frameRate: 8,
        repeat: -1,
      });

      // Animação die
      const dieKey = `player-witch-die-${dir}`;
      if (scene.anims.exists(dieKey)) {
        scene.anims.remove(dieKey);
      }
      scene.anims.create({
        key: dieKey,
        frames: dieConfig.frames.map((frame: number) => ({
          key: 'player_witch_die',
          frame: dieConfig.row * dieColumns + frame,
        })),
        frameRate: 8,
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

    this.isMoving = x !== 0 || y !== 0;

    // Determinar qual animação usar
    let animKey: string;
    if (!this.isMoving) {
      animKey = `player-witch-idle-${this.currentDirection}`;
    } else if (this.isRunning) {
      animKey = `player-witch-walk-${this.currentDirection}`;
    } else {
      animKey = `player-witch-walk-${this.currentDirection}`;
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
