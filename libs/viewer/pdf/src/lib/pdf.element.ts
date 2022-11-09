import {
  customElement,
  Entity,
  html,
  MetaElement,
  property,
} from '@pinser-metaverse/core';
import '@pinser-metaverse/design-system';
import './interactive-pdf';
import './meta-assets';
import { MetaAsset } from './meta-assets';
import { uuid } from './utils';

@customElement('viewer-pdf')
export class MetaPDFElement extends MetaElement {
  private canvasId = `canvas-${uuid().slice(0, 5)}`;
  private plainId = `pdf-plane-${uuid().slice(0, 5)}`;

  @property({
    default: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.0.279/build/pdf.min.js',
  })
  pdfsrc!: string;

  @property({
    default:
      'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.0.279/build/pdf.worker.min.js',
  })
  pdfworkersrc!: string;

  @property({ default: '4.5' })
  width!: string;

  @property({ default: '5' })
  height!: string;

  @property({ default: 'assets/test.pdf' })
  filename!: string;

  @property({ default: [] })
  attributes: { [key: string]: string | number };
  override init(): void {
    this.initAssets();
  }

  private initAssets(): void {
    const assets: MetaAsset[] = [
      {
        element: 'canvas',
        attributes: [
          {
            id: this.canvasId,
          },
        ],
      },
    ];
    let assetsEl = this.el.sceneEl?.querySelector(':scope > a-assets');
    if (!assetsEl) {
      assetsEl = document.createElement('a-assets');
      this.el.sceneEl?.appendChild(assetsEl);
    }
    assets.forEach(({ element, attributes, children }) => {
      const asset = document.createElement(`${element}`);

      attributes.forEach((item) => {
        Object.entries(item).map(([k, v]) => {
          if (typeof v === 'boolean') {
            asset.setAttribute(k, '');
          } else {
            asset.setAttribute(k, v);
          }
        });
      });

      if (children) {
        children.forEach(({ element, attributes }) => {
          const child = document.createElement(`${element}`);
          attributes.forEach((item) => {
            Object.entries(item).map(([k, v]) => {
              child.setAttribute(k, v);
            });
          });
          asset.append(child);
        });
      }
      assetsEl?.appendChild(asset);
    });
  }

  private nextPage = (): void => {
    const bookComponent = (document.getElementById('interactive-pdf') as Entity)
      .components['interactive-pdf'];
    (bookComponent as any).nextPage();
  };

  private previousPage = (): void => {
    const bookComponent = (document.getElementById('interactive-pdf') as Entity)
      .components['interactive-pdf'];
    (bookComponent as any).prevPage();
  };

  override render() {
    // console.log(`workerSrc: ${this.pdfworkersrc};`);
    return html`<a-plane
        id="${this.plainId}"
        material="shader: flat; src: #${this.canvasId};"
        width="${this.width}"
        height="${this.height}"
      ></a-plane>
      <a-entity
        id="interactive-pdf"
        interactive-pdf="id: ${this.plainId}; fileName: ${this
          .filename}; pageWidth: 1130; pageHeight: 1680; pdfSrc: ${this
          .pdfsrc}; workerSrc: ${this.pdfworkersrc};"
      >
        <meta-button
          content="Next"
          icon="navigate_next"
          position="-1.500 -2.823 0.010"
          scale="3 3 1"
          @click=${() => this.nextPage()}
        ></meta-button>

        <meta-button
          content="Previous"
          icon="navigate_before"
          position="0.501 -2.823 .010"
          scale="3 3 1"
          @click=${() => this.previousPage()}
        ></meta-button>
      </a-entity>`;
  }
}
