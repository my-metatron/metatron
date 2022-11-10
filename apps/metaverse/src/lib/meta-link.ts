import type { MetaAsset } from '@metapin/viewer/pdf';
import {
  customElement,
  html,
  MetaElement,
  property,
} from '@pinser-metaverse/core';

@customElement('meta-link')
export class MetaverseBootstrapSpaceElement extends MetaElement {
  @property({ default: '' })
  href: string;

  @property({ default: '' })
  imageid: string;

  @property({ default: [] })
  assets: MetaAsset[];

  override init(): void {
    this.initAssets();
  }

  private initAssets(): void {
    let assetsEl = this.el.sceneEl?.querySelector(':scope > a-assets');
    if (!assetsEl) {
      assetsEl = document.createElement('a-assets');
      this.el.sceneEl?.appendChild(assetsEl);
    }
    this.assets.forEach(({ element, attributes, children }) => {
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

  override render() {
    return html`
      <a-link
        href="${this.href}"
        position="2.897 1.675 -2.606"
        image="${this.imageid}"
      ></a-link>
    `;
  }
}
