import * as Phaser from 'phaser';
import { MessageBox } from '../../ui';

export interface InteractableItem {
  id: string;
  x: number;
  y: number;
  message: string;
  sprite?: Phaser.GameObjects.Sprite;
}

/**
 * Sistema de interação - gerencia proximidade e interação com objetos
 */
export class InteractionSystem {
  private scene: Phaser.Scene;
  private messageBox: MessageBox;
  private interactables: InteractableItem[] = [];
  private interactionIndicator!: Phaser.GameObjects.Container;
  private actionKey!: Phaser.Input.Keyboard.Key;

  private readonly INTERACTION_DISTANCE = 30;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.messageBox = new MessageBox();

    this.setupActionKey();
    this.createInteractionIndicator();
  }

  private setupActionKey(): void {
    this.actionKey = this.scene.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.X
    );
  }

  /**
   * Cria o indicador visual "X" que aparece sobre objetos interativos
   */
  private createInteractionIndicator(): void {
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x000000, 0.7);
    bg.fillRoundedRect(-10, -10, 20, 20, 4);

    const xText = this.scene.add.text(0, 0, 'X', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: '#ffff00',
    });
    xText.setOrigin(0.5, 0.5);

    this.interactionIndicator = this.scene.add.container(0, 0, [bg, xText]);
    this.interactionIndicator.setDepth(9999);
    this.interactionIndicator.setVisible(false);
  }

  /**
   * Registra um objeto como interativo
   */
  registerInteractable(data: InteractableItem): void {
    this.interactables.push(data);
  }

  /**
   * Registra múltiplos objetos interativos
   */
  registerInteractables(data: InteractableItem[]): void {
    this.interactables.push(...data);
  }

  /**
   * Limpa todos os interativos registrados
   */
  clearInteractables(): void {
    this.interactables = [];
  }

  /**
   * Atualiza o sistema - deve ser chamado no update() da scene
   */
  update(playerX: number, playerY: number): void {
    // Encontrar objeto mais próximo
    let nearestObj: InteractableItem | null = null;
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

    // Atualizar indicador visual
    if (canInteract && !this.messageBox.isVisible) {
      this.interactionIndicator.setPosition(nearestObj!.x, nearestObj!.y - 25);
      this.interactionIndicator.setVisible(true);
    } else {
      this.interactionIndicator.setVisible(false);
    }

    // Se mensagem está visível, X fecha ela
    if (this.messageBox.isVisible) {
      if (Phaser.Input.Keyboard.JustDown(this.actionKey)) {
        this.messageBox.hide();
      }
      return;
    }

    const canTravel = nearestObj && (nearestObj.id === 'hall' || nearestObj.id === 'garden') && nearestDistance <= this.INTERACTION_DISTANCE;

    // Verificar se X foi pressionado para interagir
    if (canInteract && Phaser.Input.Keyboard.JustDown(this.actionKey)) {

      if (canTravel) {
        this.travelToChallenge(nearestObj!.id);
        return;
      }

      this.messageBox.show(nearestObj!.message);
    }
  }

  travelToChallenge(id: string): void {
    let mapScene

    switch (id) {
      case 'hall':
        mapScene = 'HallScene';
        break;
      case 'garden':
        mapScene = 'GardenScene';
        break;
      default:
        return;
    }

    this.scene.scene.start(mapScene, {
      fromScene: this.scene.scene.key,
      spawnPoint: id,
    });
  }


  destroy(): void {
    this.messageBox.destroy();
    this.interactionIndicator.destroy();
  }
}
