import {
  customElement,
  html,
  inject,
  MetaElement,
  property,
  TemplateResult,
} from '@pinser-metaverse/core';
import { PlayerProvider } from '@pinser-metaverse/player';
import './add-commands';
import './speach-recognition';

@customElement('utils-weather')
export class WeatherElement extends MetaElement {
  @property({
    default: '0 0 0',
  })
  position!: string;

  @property({
    default: '0 0 0',
  })
  teleportposition!: string;

  @inject()
  playerProvider!: PlayerProvider;

  override init(): void {
    this.initAssets();
    window.addEventListener(
      'positionplayer',
      this.computeCursorPosition.bind(this)
    );
  }

  private initAssets(): void {
    const assetsEl = this.el.sceneEl?.querySelector('#annyang');
    if (!assetsEl) {
      console.log('creating');
      const speachEl = document.createElement('a-entity');
      speachEl.setAttribute('id', 'annyang');
      speachEl.setAttribute('annyang-speech-recognition', '');
      this.el.sceneEl?.appendChild(speachEl);
    }
  }

  private computeCursorPosition() {
    this.playerProvider.teleport(`${this.teleportposition}`, '0 0 0');
  }

  override render(): TemplateResult {
    return html`
      <!-- welcome panel -->
      <a-entity id="weatherentity" add-commands position="${this.position}">
        <meta-dialog width="2" height="1" rotation="0 0 0">
          <a-image
            src="./assets/temperature.png"
            width="0.5"
            height="0.5"
            position="0.367 0.392 0.001"
          ></a-image>
          <a-text
            value="Paris, France"
            color="#000000"
            align="center"
            position="0.966 0.830 0.001"
            width="2"
          ></a-text>
          <a-text
            value="
          6 Celsius

Have A Pleasent Day !"
            color="#000000"
            align="left"
            position="0.762 0.384 0.001"
            width="1.2"
          ></a-text>
        </meta-dialog>
      </a-entity>
    `;
  }
}
