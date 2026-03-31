import * as Phaser from 'phaser';

export class WorldMapEntity {
  public readonly map: Phaser.Tilemaps.Tilemap;
  public readonly width: number;
  public readonly height: number;

  constructor(private readonly scene: Phaser.Scene, mapKey: string) {
      this.map = this.scene.make.tilemap({ key: mapKey });

      // Adiciona TODOS os tilesets e filtra os que carregaram com sucesso
      const tilesets = this.map.tilesets
        .map((tileset) => {
          const name = tileset.name?.trim();
          if (!name || !this.scene.textures.exists(name)) {
            console.warn(`Textura não encontrada para tileset: "${name}"`);
            return null;
          }
          return this.map.addTilesetImage(name, name);
        })
        .filter((tileset): tileset is Phaser.Tilemaps.Tileset => tileset !== null);

      if (tilesets.length === 0) {
        throw new Error('Nenhum tileset carregado com sucesso.');
      }

      // Passa o array completo de tilesets para cada layer
      this.map.layers.forEach((layerData) => {
        this.map.createLayer(layerData.name, tilesets, 0, 0);
      });

      this.width = this.map.widthInPixels;
      this.height = this.map.heightInPixels;
    }
}
