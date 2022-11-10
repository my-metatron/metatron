import type { MetaAsset } from '@metapin/viewer/pdf';
import {
  customElement,
  html,
  inject,
  MetaElement,
} from '@pinser-metaverse/core';
import '@pinser-metaverse/design-system';
import '@pinser-metaverse/gltf';
import { PlayerProvider } from '@pinser-metaverse/player';
import '@pinser-metaverse/teleport';
import './meta-link';
const assets: MetaAsset[] = [
  {
    element: 'img',
    attributes: [
      {
        id: 'thumbforest',
        src: '/assets/forest.png',
        crossorigin: 'anonymous',
        alt: 'thumbforest',
      },
    ],
  },
];

@customElement('metaverse-bootstrap-space')
export class MetaverseBootstrapSpaceElement extends MetaElement {
  @inject()
  playerProvider: PlayerProvider;

  override init(): void {
    const asceneEl = document.querySelector('a-scene');
    if (asceneEl) {
      asceneEl.setAttribute('raycaster', 'objects: [link];');
      asceneEl.setAttribute('cursor', 'rayOrigin: mouse;');
      asceneEl.setAttribute('camera-position', '');
      asceneEl.setAttribute(
        'environment',
        `preset: japan;
      dressingUniformScale: true; 
      dressingColor: #248728; 
      ground: canyon; 
      groundTexture: walkernoise; 
      groundColor: #34711C; 
      groundColor2: #319D06; 
      grid: none; 
      gridColor: #81F995; 
      skyType: gradient; 
      skyColor: #A4CFFA; 
      horizonColor: #95C8FA;
      lightPosition: 0 2 12;
      fog: .75;
      `
      );
    }
    const el = document.querySelectorAll('[networked-audio-source=""]');
    if (el && el.length === 1) {
      el[0].setAttribute('wasd-controls', 'acceleration:100');
    }
    this.playerProvider.setInfo({
      username: localStorage.getItem('username') || 'Visiteur',
      avatar: localStorage.getItem('avatar') || '/assets/visitor.glb',
      preview: localStorage.getItem('preview') || '/assets/visitor.png',
    });
  }

  override render() {
    return html`

    <!-- space -->  
      <a-sky hide-on-ar color="#80d4ff"></a-sky>
     <meta-link assets="${JSON.stringify(assets)}" imageId="#thumbforest"
     href="forest.html"
     ></meta-link>
      <!-- IDLE man -->
      <meta-gltf
        url="./assets/man.glb"
        animations="./assets/animations.glb"
        playing="clip: IDLE;"
        position="-0.854 0 -1.754"
        rotation="0 34.26 0"></meta-gltf>
      ></meta-gltf>
      
      <!-- welcome panel -->
      <meta-dialog width="2" height="1" rotation="0 0 0" position="-1 1.2 -2">
        <a-image
          src="./assets/logo.png"
          width="0.5"
          height="0.5"
          position="0.367 0.392 0.001"
        ></a-image>
        <a-text
          value="Welcome in the new web Landing Page"
          color="#000000"
          align="center"
          position="0.966 0.830 0.001"
          width="2"
        ></a-text>
        <a-text
          value="
You can move around by teleporting with the white ring pointing to the ground.

Good visit !"
          color="#000000"
          align="left"
          position="0.762 0.384 0.001"
          width="1.2"
        ></a-text>
      </meta-dialog>

      <meta-teleport position="0 0.001 0"></meta-teleport>

      <!-- ground -->
      <meta-teleportable
        hide-on-ar
        width="22.9"
        height="16.92"
        color="#d99f20"
        position="0 0.1 0"
      ></meta-teleportable>`;
  }
}
