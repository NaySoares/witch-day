import * as Phaser from 'phaser';

/**
 * Cena de preload - carrega todos os assets do jogo
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    // Criar barra de progresso
    this.createLoadingBar();
    // Carregar sprites do jogador
    this.loadPlayerSprites();
    // Carregar mapa e tileset exportados pelo Tiled
    this.loadMapAssets();
  }


  /**
   * Carrega spritesheets do personagem
   */
  private loadPlayerSprites(): void {
    // 136x144px, matrix 4x4 = frames de 34x36px
    this.load.spritesheet('player', '/assets/sprites/player/default/player_default.png', {
      frameWidth: 34,
      frameHeight: 36,
    });

    this.load.spritesheet('player_run', '/assets/sprites/player/default/player_default_run.png', {
      frameWidth: 34,
      frameHeight: 36,
    });

    // WITCH

    this.load.spritesheet('player_witch', '/assets/sprites/player/witch/witch_idle.png', {
      frameWidth: 25,
      frameHeight: 32,
    });

    this.load.spritesheet('player_witch_walk', '/assets/sprites/player/witch/witch_walk.png', {
      frameWidth: 25,
      frameHeight: 33,
    });

    this.load.spritesheet('player_witch_die', '/assets/sprites/player/witch/witch_die.png', {
      frameWidth: 34,
      frameHeight: 32,
    });
  }

  /**
   * Carrega assets do mapa
   */
  private loadMapAssets(): void {
    // carrega os tilemaps
    this.load.tilemapTiledJSON('map_world', '/assets/tiledConfig/map_world.json');
    this.load.tilemapTiledJSON('map_house', '/assets/tiledConfig/map_house.json');
    this.load.tilemapTiledJSON('map_house_professor', '/assets/tiledConfig/map_house_professor.json');
    this.load.tilemapTiledJSON('map_world_professor', '/assets/tiledConfig/map_world_professor.json');
    this.load.tilemapTiledJSON('map_hall', '/assets/tiledConfig/map_hall.json');

    // carrega os tilesets
    this.load.image('house', '/assets/tileset/house.png');
    this.load.image('tileset_witch', '/assets/tileset/tileset_witch.png');
    this.load.image('tileset_house_professor', '/assets/tileset/tileset_house_professor.png');
    this.load.image('interiors', '/assets/tileset/interiors.png');
  }

  create(): void {
    // Iniciar a cena principal do jogo
    this.scene.start('WorldScene');
  }

  private createLoadingBar(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    // Background da barra
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 4, height / 2 - 15, width / 2, 30);

    // Texto de loading
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Carregando...', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5, 0.5);

    // Texto de porcentagem
    const percentText = this.add.text(width / 2, height / 2, '0%', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#ffffff',
    });
    percentText.setOrigin(0.5, 0.5);

    // Eventos de progresso
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x3b82f6, 1);
      progressBar.fillRect(width / 4 + 5, height / 2 - 10, (width / 2 - 10) * value, 20);
      percentText.setText(`${Math.floor(value * 100)}%`);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });
  }
}
