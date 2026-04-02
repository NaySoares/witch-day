import { containerStyle, imageStyle, nameStyle, textStyle, wrapperStyle, instructionStyle } from './DialogStyle';

const TEXT_TO_SHOW_NEXT = '[X] continuar';
const KEY_TO_CONTINUE = 'x';

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
    if (e.key === KEY_TO_CONTINUE || e.key === KEY_TO_CONTINUE.toUpperCase()) {
      this.hide();
    }
  }

  registerDialog(dialogData: { text: string; character?: string; portrait?: string }[]): void {
    let currentIndex = 0;
    this._isInSequence = true;

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key !== KEY_TO_CONTINUE && e.key !== KEY_TO_CONTINUE.toUpperCase()) return;

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
    container.style.cssText = containerStyle;
    return container;
  }

  // Portrait fica FORA do container — flutua sobre a caixa
  private createPortrait(): HTMLImageElement {
    const image = document.createElement('img');
    image.style.cssText = imageStyle;
    return image;
  }

  private createContent(): {
    wrapper: HTMLDivElement;
    name: HTMLDivElement;
    text: HTMLDivElement;
  } {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = wrapperStyle;

    const name = document.createElement('div');
    name.style.cssText = nameStyle;

    const text = document.createElement('div');
    text.style.cssText = textStyle;

    const instruction = document.createElement('div');
    instruction.style.cssText = instructionStyle;

    instruction.textContent = TEXT_TO_SHOW_NEXT;

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