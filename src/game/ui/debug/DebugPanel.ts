import { containerStyle } from "./DebugStyle";

/**
 * Painel de debug DOM - mostra informações de desenvolvimento
 */
export class DebugPanel {
  private container: HTMLDivElement;
  private _isEnabled: boolean = false;

  constructor() {
    this.container = this.createContainer();
    document.body.appendChild(this.container);
  }

  private createContainer(): HTMLDivElement {
    if (this._isEnabled) {

      const container = document.createElement('div');
      container.style.cssText = containerStyle;
      return container;
    }
    return document.createElement('div');
  }

  setText(text: string): void {
    if (this._isEnabled) {
      this.container.textContent = text;
    }
  }

  addLine(label: string, value: string | number): void {
    const line = document.createElement('div');
    line.textContent = `${label}: ${value}`;
    this.container.appendChild(line);
  }

  clear(): void {
    this.container.textContent = '';
  }

  setEnabled(enabled: boolean): void {
    this._isEnabled = enabled;
    this.container.style.display = enabled ? 'block' : 'none';
  }

  get isEnabled(): boolean {
    return this._isEnabled;
  }

  destroy(): void {
    this.container.remove();
  }
}
