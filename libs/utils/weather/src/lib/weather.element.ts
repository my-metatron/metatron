import {
  customElement,
  html,
  MetaElement,
  TemplateResult,
} from '@pinser-metaverse/core';

@customElement('utils-weather')
export class WeatherElement extends MetaElement {
  override render(): TemplateResult {
    return html`<a-box></a-box>`;
  }
}
