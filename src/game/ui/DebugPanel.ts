/**
 * Painel de debug DOM - mostra informações de desenvolvimento
 */
export class DebugPanel {
  private container: HTMLDivElement;
  private _isEnabled: boolean = true;

  constructor() {
    this.container = this.createContainer();
    document.body.appendChild(this.container);
  }

  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      font-family: monospace;
      font-size: 14px;
      padding: 8px 12px;
      border-radius: 4px;
      z-index: 1000;
      min-width: 150px;
    `;
    return container;
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
