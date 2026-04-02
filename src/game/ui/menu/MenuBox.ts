import { containerStyle, textStyle, instructionStyle } from "./MenuStyle";

const TEXT_TO_SHOW_NEXT = '[ENTER] fechar';

export class MenuBox {
  private container: HTMLDivElement;
  private textElement: HTMLDivElement
  private _isVisible: boolean = false;

  constructor() {
    this.container = this.createContainer();
    this.textElement = this.createTextElement();
    const instruction = this.createInstructionElement();

    this.container.appendChild(this.textElement);
    this.container.appendChild(instruction);
    document.body.appendChild(this.container);
  }

  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.style.cssText = containerStyle;
    return container;
  }

  private createTextElement(): HTMLDivElement {
    const text = document.createElement('div');
    text.style.cssText = textStyle;
    return text;
  }

  private createInstructionElement(): HTMLDivElement {
    const instruction = document.createElement('div');
    instruction.style.cssText = instructionStyle;
    instruction.textContent = TEXT_TO_SHOW_NEXT;
    return instruction;
  }

  show(text: string): void {
    this.textElement.textContent = text;
    this.container.style.display = 'block';
    this._isVisible = true;
  }

  hide(): void {
    this.container.style.display = 'none';
    this._isVisible = false;
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  destroy(): void {
    this.container.remove();
  }

}