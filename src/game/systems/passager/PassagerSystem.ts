import * as Phaser from 'phaser';

export interface InteractableData {
  id: string;
  x: number;
  y: number;
  scene: string;
}

export class PassagerSystem {
  private passagerZones: Phaser.GameObjects.Zone[] = [];
  private sceneToSwitch: Phaser.Scene;
  private interactables: InteractableData[] = [];
  private actionKey!: Phaser.Input.Keyboard.Key;

  private readonly INTERACTION_DISTANCE = 30;

  constructor(private readonly scene: Phaser.Scene) {
    this.sceneToSwitch = scene;
    this.setupActionKey();
  }

  private setupActionKey(): void {
    this.actionKey = this.scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.X
    );
  }

  /**
   * Registra um objeto como interativo
   */
  registerInteractable(data: InteractableData): void {
    this.interactables.push(data);
  }

  /**
   * Registra múltiplos objetos interativos
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
      this.passagerZones.push(passagerZone);
      this.sceneToSwitch.physics.add.collider(target, passagerZone);
    });
  }

  update(playerX: number, playerY: number): void {
    // Encontrar objeto mais próximo
    let nearestObj: InteractableData | null = null;
    let nearestDistance = Infinity;

    for (const obj of this.interactables) {
      const distance = Phaser.Math.Distance.Between(playerX, playerY, obj.x, obj.y);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestObj = obj;
      }
    }

    // Verificar se pode interagir
    const canInteract = nearestObj && nearestDistance <= this.INTERACTION_DISTANCE;

    // Verificar se X foi pressionado para interagir
    if (canInteract && Phaser.Input.Keyboard.JustDown(this.actionKey)) {
      this.switchToScene(nearestObj!);
    }
  }

  private switchToScene(interactable: InteractableData): void {
  if (!interactable.scene) return;

  // Para a cena atual e inicia a nova
  this.scene.scene.start(interactable.scene, {
    fromScene: this.scene.scene.key,
    spawnPoint: interactable.id, // ex: "door_exit" para saber onde spawnar o player
  });
}


  destroy(): void {
    this.passagerZones.forEach((zone) => zone.destroy());
    this.passagerZones = [];
  }
}
