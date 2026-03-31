export class DialogBox {
  private container: HTMLDivElement;
  private characterImage: HTMLImageElement;
  private characterName: HTMLDivElement;
  private textElement: HTMLDivElement;
  private _isVisible: boolean = false;
  private _isInSequence: boolean = false;

  private boundKeyHandler: (e: KeyboardEvent) => void;

  constructor() {
    this.container = this.createContainer();

    this.characterImage = this.createPortrait();
    const content = this.createContent();
    this.characterName = content.name;
    this.textElement = content.text;

    this.container.appendChild(content.wrapper);
    document.body.appendChild(this.characterImage);
    document.body.appendChild(this.container);

    this.boundKeyHandler = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.boundKeyHandler);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this._isVisible) return;
    if (this._isInSequence) return;
    if (e.key === 'x' || e.key === 'X') {
      this.hide();
    }
  }

  registerDialog(dialogData: { text: string; character?: string; portrait?: string }[]): void {
    let currentIndex = 0;
    this._isInSequence = true;

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key !== 'x' && e.key !== 'X') return;

      if (currentIndex < dialogData.length) {
        const data = dialogData[currentIndex];
        this.show(data.text, data.character, data.portrait);
        currentIndex++;
      } else {
        this.hide();
        this._isInSequence = false;
        window.removeEventListener('keydown', keyHandler);
      }
    };

    // Mostra o primeiro imediatamente
    const first = dialogData[currentIndex];
    this.show(first.text, first.character, first.portrait);
    currentIndex++;

    window.addEventListener('keydown', keyHandler);
  }

  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 180px;
      background: rgba(10, 10, 30, 0.95);
      border-top: 3px solid #a78bfa;
      display: none;
      z-index: 1000;
      font-family: 'Press Start 2P', Arial, sans-serif;
      box-sizing: border-box;
      flex-direction: row;
      align-items: stretch;
    `;
    return container;
  }

  // Portrait fica FORA do container — flutua sobre a caixa
  private createPortrait(): HTMLImageElement {
    const image = document.createElement('img');
    image.style.cssText = `
      position: fixed;
      bottom: 0px;
      left: 32px;
      height: 55vh;
      width: 280px;
      object-fit: contain;
      object-position: bottom left;
      z-index: 1001;
      display: none;
      pointer-events: none;
      filter: drop-shadow(4px 0px 8px rgba(167, 139, 250, 0.4));
    `;
    return image;
  }

  private createContent(): {
    wrapper: HTMLDivElement;
    name: HTMLDivElement;
    text: HTMLDivElement;
  } {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 16px 24px 16px 336px;
      box-sizing: border-box;
      overflow: hidden;
    `;

    const name = document.createElement('div');
    name.style.cssText = `
      color: #a78bfa;
      font-size: 11px;
      letter-spacing: 1px;
      margin-bottom: 10px;
      text-transform: uppercase;
    `;

    const text = document.createElement('div');
    text.style.cssText = `
      color: #f0f0f0;
      font-size: 12px;
      line-height: 1.8;
      flex: 1;
    `;

    const instruction = document.createElement('div');
    instruction.style.cssText = `
      color: #6b7280;
      font-size: 9px;
      text-align: right;
      margin-top: 10px;
    `;
    instruction.textContent = '[X] continuar';

    wrapper.appendChild(name);
    wrapper.appendChild(text);
    wrapper.appendChild(instruction);

    return { wrapper, name, text };
  }

  show(text: string, characterName?: string, portraitSrc?: string): void {
    this.textElement.textContent = text;
    this.characterName.textContent = characterName ?? '';

    if (portraitSrc) {
      this.characterImage.src = portraitSrc;
      this.characterImage.style.display = 'block';
    } else {
      this.characterImage.style.display = 'none';
    }

    this.container.style.display = 'flex';
    this._isVisible = true;
  }

  hide(): void {
    this.container.style.display = 'none';
    this.characterImage.style.display = 'none';
    this._isVisible = false;
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  destroy(): void {
    this.container.remove();
    this.characterImage.remove();
    window.removeEventListener('keydown', this.boundKeyHandler);
  }
}