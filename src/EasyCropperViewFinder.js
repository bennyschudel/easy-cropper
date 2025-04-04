import { css, html, LitElement } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * A custom element for cropping an image using a predefined of free ratio.
 *
 * This component can crop a given image into a different aspect ratio and size.
 *
 * @class
 * @extends {LitElement}
 */
export class EasyCropperViewFinder extends LitElement {
  rootEl = createRef();

  static properties = {
    width: { type: Number },
    height: { type: Number },
  };

  constructor() {
    super();

    this.width = 0;
    this.height = 0;
  }

  // --- getters ---

  get aspectRatio() {
    return this.width / this.height;
  }

  get orientation() {
    return this.aspectRatio < 1 ? 'portrait' : this.aspectRatio > 1 ? 'landscape' : 'square';
  }

  // --- lifecycle ---

  // --- render

  render() {
    return html`
      <div
        ${ref(this.rootEl)}
        class="view-finder"
        data-orientation=${this.orientation}
        style=${styleMap({
          '--width': `${this.width}px`,
          '--height': `${this.height}px`,
          '--aspect-ratio': `${this.aspectRatio}`,
        })}
      ></div>
    `;
  }

  // --- styles ---

  static styles = css`
    :host {
      --border-color: hsla(0, 100%, 100%, 0.5);

      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;

      *,
      *::after,
      *::before {
        box-sizing: inherit;
      }
    }

    .view-finder {
      border: 1px solid var(--border-color);

      width: var(--width);
      height: var(--height);
    }
  `;
}
