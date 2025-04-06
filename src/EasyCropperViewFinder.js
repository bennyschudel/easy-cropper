import { css, html, LitElement } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * @typedef {"portrait"|"landscape"|"square"} Orientation
 */

/**
 * A custom element to show a view-finder.
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

  /**
   * Gets the aspect ratio of the view-finder.
   *
   * @type {number}
   * @returns {number} The aspect ratio (width / height).
   */
  get aspectRatio() {
    return this.width / this.height;
  }

  /**
   * Determines the orientation of the cropper view based on the aspect ratio.
   *
   * @type {Orientation}
   * @returns {Orientation} The orientation of the cropper view:
   * - `'portrait'` if the aspect ratio is less than 1.
   * - `'landscape'` if the aspect ratio is greater than 1.
   * - `'square'` if the aspect ratio is equal to 1.
   */
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
