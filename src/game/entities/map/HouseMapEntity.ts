import * as Phaser from 'phaser';

export class HouseMapEntity {
  public readonly map: Phaser.Tilemaps.Tilemap;
  public readonly width: number;
  public readonly height: number;

  constructor(private readonly scene: Phaser.Scene, mapKey: string) {
    this.map = this.scene.make.tilemap({ key: mapKey });

    const tilesetNameFromMap = this.map.tilesets[0]?.name?.trim() || 'house';
    const possibleTextureKeys = [
      'house',
      tilesetNameFromMap,
      'house.png',
      '../tileset/house.png',
    ];

    const tilesetTextureKey = possibleTextureKeys.find((key) => this.scene.textures.exists(key));
    if (!tilesetTextureKey) {
      throw new Error(
        `Nenhuma textura de tileset encontrada. Tentativas: ${possibleTextureKeys.join(', ')}`,
      );
    }

    const tileset =
      this.map.addTilesetImage(tilesetNameFromMap, tilesetTextureKey) ||
      this.map.addTilesetImage('house', tilesetTextureKey);

    if (!tileset) {
      throw new Error(
        `Tileset nao encontrado no mapa ${mapKey}. Nome no mapa: ${tilesetNameFromMap}, textura: ${tilesetTextureKey}`,
      );
    }

    this.map.layers.forEach((layerData) => {
      this.map.createLayer(layerData.name, tileset, 0, 0);
    });

    this.width = this.map.widthInPixels;
    this.height = this.map.heightInPixels;
  }
}
