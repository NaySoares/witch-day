import * as Phaser from 'phaser';
import { InteractableData } from './TravelSystem';

export class TravelFastSystem {
  private travelZones: Phaser.GameObjects.Zone[] = [];
  private sceneToSwitch: Phaser.Scene;
  private interactables: InteractableData[] = [];
  private isTransitioning = false;

  private readonly INTERACTION_DISTANCE = 20;

  constructor(private readonly scene: Phaser.Scene) {
    this.sceneToSwitch = scene;
  }

  /**
   * Registra um objeto como interativo
   */
  registerInteractable(data: InteractableData): void {
    this.interactables.push(data);
  }

  /**
   * Registra multiplos objetos interativos
   */
  registerInteractables(data: InteractableData[]): void {
    this.interactables.push(...data);
  }

  /**
   * Limpa todos os interativos registrados
   */
  clearInteractables(): void {
    this.interactables = [];
  }

  bindObjectLayer(
    map: Phaser.Tilemaps.Tilemap,
    layerName: string,
    target: Phaser.Physics.Arcade.Sprite,
  ): void {
    const passagerObjectLayer = map.getObjectLayer(layerName);
    if (!passagerObjectLayer) {
      return;
    }

    passagerObjectLayer.objects.forEach((objectData) => {
      if (!objectData.width || !objectData.height) {
        return;
      }

      const passagerZone = this.scene.add.zone(
        (objectData.x ?? 0) + objectData.width / 2,
        (objectData.y ?? 0) + objectData.height / 2,
        objectData.width,
        objectData.height,
      );

      this.sceneToSwitch.physics.add.existing(passagerZone, true);
      this.travelZones.push(passagerZone);
      this.sceneToSwitch.physics.add.collider(target, passagerZone);
    });
  }

  update(playerX: number, playerY: number): void {
    if (this.isTransitioning) {
      return;
    }

    // Encontrar objeto mais proximo
    let nearestObj: InteractableData | null = null;
    let nearestDistance = Infinity;

    for (const obj of this.interactables) {
      const distance = Phaser.Math.Distance.Between(playerX, playerY, obj.x, obj.y);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestObj = obj;
      }
    }

    // Verificar se pode interagir automaticamente
    const canInteract = nearestObj && nearestDistance <= this.INTERACTION_DISTANCE;


    if (canInteract) {
      this.switchToScene(nearestObj!);
    }
  }

  private switchToScene(interactable: InteractableData): void {
    if (!interactable.scene || this.isTransitioning) {
      return;
    }

    this.isTransitioning = true;

    // Para a cena atual e inicia a nova
    this.scene.scene.start(interactable.scene, {
      fromScene: this.scene.scene.key,
      spawnPoint: interactable.id,
    });
  }

  destroy(): void {
    this.travelZones.forEach((zone) => zone.destroy());
    this.travelZones = [];
    this.isTransitioning = false;
  }
}
