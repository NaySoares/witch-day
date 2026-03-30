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
    container.style.cssText = `
      position: fixed;
      bottom: 50%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      border: 2px solid white;
      border-radius: 8px;
      padding: 15px 30px;
      text-align: center;
      display: none;
      z-index: 1000;
      font-family: Arial, sans-serif;
      min-width: 200px;
      max-width: 400px;
    `;
    return container;
  }

  private createTextElement(): HTMLDivElement {
    const text = document.createElement('div');
    text.style.cssText = `
      color: white;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    `;
    return text;
  }

  private createInstructionElement(): HTMLDivElement {
    const instruction = document.createElement('div');
    instruction.style.cssText = `
      color: #aaaaaa;
      font-size: 12px;
    `;
    instruction.textContent = '[ENTER] fechar';
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