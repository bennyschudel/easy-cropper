import { css, html, LitElement } from 'lit';
import { ref, createRef } from 'lit/directives/ref.js';
import { styleMap } from 'lit/directives/style-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import * as d3 from './d3';

import { checkMapHasAnyKey, minZero } from './utils';
import { copyImageToClipboard } from './helpers';

/**
 * @typedef {"png"|"jpg"|"jpeg"|"webp"} ImageFormat
 */

/**
 * @typedef {Object} ImageTransform
 * @property {number} transform.k - The scale factor for zooming.
 * @property {number} transform.x - The x-coordinate for translation.
 * @property {number} transform.y - The y-coordinate for translation.
 */

/**
 * A custom element to provide functionality for cropping images.
 *
 * @class
 * @extends {LitElement}
 *
 * @property {string} aspectRatio - The aspect ratio to be cropped. Can be either a value or an equation like 16:9.
 * @property {ImageFormat} format - The format of the output image to be generated.
 * @property {number} maxZoom - The maximum zoom level allowed. Default is 5.
 * @property {number} padding - The padding around the view-finder in pixels. Default is 64px.
 * @property {boolean} noPixels - Whether to display interpolated pixels when the image is zoomed in or not.
 * @property {number} quality - A number between 0 and 1 indicating the image quality if the format is "jpeg" or "webp".
 * @property {string} src - The source URL of the image to be cropped.
 */
export class EasyCropper extends LitElement {
  rootEl = createRef();
  viewFinderEl = createRef();
  canvasEl = createRef();
  imageEl = createRef();

  static properties = {
    _rootDimensions: { state: true },
    _viewFinderMaxDimensions: { state: true },
    _imageTransform: { state: true },
    _minZoom: { type: Number },
    _sourceImageAspectRatio: { state: true },
    // ---
    aspectRatio: { type: String },
    format: { type: String },
    maxZoom: { type: Number },
    padding: { type: Number },
    noPixels: { type: Boolean, reflect: true },
    quality: { type: Number },
    src: { type: String },
    // ---
    onCrop: { type: Function },
  };

  _zoomBehaviour;
  _sourceImageData;
  _aspectRatio;

  constructor() {
    super();

    this._imageTransform = d3.zoomIdentity;
    this._minZoom = 1.0;
    this._rootDimensions = [0, 0];
    this._sourceImageAspectRatio = undefined;
    this._viewFinderDimensions = [0, 0];
    this._viewFinderMaxDimensions = [0, 0];

    this.aspectRatio = "1:1";
    this.format = 'png';
    this.maxZoom = 5;
    this.padding = undefined;
    this.noPixels = false;
    this.quality = 1.0;
    this.src = undefined;

    this.onCrop = () => {};
  }

  // --- accessors ---

  /**
   * Gets the aspect ratio of the cropped areaa.
   *
   * @type {number}
   * @returns {number} The current aspect ratio.
   */
  get aspectRatio() {
    return this._aspectRatio;
  }

  /**
   * Sets the aspect ratio for the cropped area.
   *
   * @param {string|number} value - The aspect ratio to set. Can be a numeric value or a string in the format "16:9".
   * @throws {Error} If the provided value is not a valid value.
   */
  set aspectRatio(value) {
    const [a, b] = String(value).split(':');

    const ratio = b === undefined ? Number(a) : Number(a) / Number(b);

    if (isNaN(ratio)) {
      throw new Error('Invalid aspect ratio.');
    }

    this._aspectRatio = ratio;
  }

  // --- getters ---

  get #imageTransform() {
    return this._imageTransform.toString();
  }

  // --- private getters ---

  /**
   * Gets the width of the root element.
   *
   * @type {number}
   * @returns {number} The width of the root element in pixels.
   */
  get width() {
    return this._rootDimensions[0];
  }

  /**
   * Gets the height of the root element.
   *
   * @type {number}
   * @returns {number} The height of the root element in pixels.
   */
  get height() {
    return this._rootDimensions[1];
  }

  /**
   * Gets the width of the view-finder.
   *
   * @type {number}
   * @returns {number} The width of the view-finder in pixels.
   */
  get viewFinderWidth() {
    return this._viewFinderDimensions[0];
  }

  /**
   * Gets the height of the view-finder.
   *
   * @type {number}
   * @returns {number} The height of the view-finder in pixels.
   */
  get viewFinderHeight() {
    return this._viewFinderDimensions[1];
  }

  /**
   * Gets the width of the source image data.
   *
   * @type {number}
   * @returns {number | undefined} The width of the source image, or undefined if the source image data is not available.
   */
  get sourceWidth() {
    return this._sourceImageData?.width;
  }

  /**
   * Gets the height of the source image data.
   *
   * @type {number}
   * @returns {number | undefined} The height of the source image data, or undefined if no source image data is available.
   */
  get sourceHeight() {
    return this._sourceImageData?.height;
  }

  /**
   * Getter to check if a source image is available.
   *
   * @type {boolean}
   * @returns {boolean} Returns `true` if a source image is set, otherwise `false`.
   */
  get hasSourceImage() {
    return Boolean(this._sourceImageData);
  }

  /**
   * Gets the zoom extent for the crop area.
   *
   * @type {Array<number, number>}
   * @returns {Array<number, number>} An array containing the minimum and maximum zoom levels.
   */
  get zoomExtent() {
    return [this._minZoom, this.maxZoom];
  }

  // --- private methods ---

  #calculateViewFinderDimensions() {
    const { aspectRatio } = this;

    const [maxWidth, maxHeight] = this._viewFinderMaxDimensions;

    const newWidth = maxHeight * aspectRatio;
    const newHeight = maxWidth / aspectRatio;

    if (newWidth <= maxWidth) {
      return [newWidth, maxHeight];
    } else {
      return [maxWidth, newHeight];
    }
  }

  #getMimeType(format = this.format) {
    const type = {
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    }[format];

    return type;
  }

  // --- methods ---

  /**
   * Loads an image from the specified URL, sets it as the source for the image element,
   * and calculates the aspect ratio of the source image.
   *
   * @param {string} src - The source URL of the image to load.
   * @returns {Promise<HTMLImageElement>} A promise that resolves to the loaded image element.
   * @throws {Error} Throws an error if the image fails to load.
   */
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        const { width, height } = image;

        this._sourceImageData = image;
        this._sourceImageAspectRatio = width / height;

        this.imageEl.value.setAttribute('href', src);

        resolve(image);
      };

      image.onerror = () => {
        reject('Failed to load image.');
      };

      image.src = src;
    });
  }

  /**
   * Loads an image from a Blob object.
   *
   * @param {Blob} blob - The Blob object containing the image data.
   * @returns {Promise<HTMLImageElement>} A promise that resolves to the loaded image element.
   * @throws {Error} Throws an error if the image fails to load.
   */
  async loadImageBlob(blob) {
    const src = URL.createObjectURL(blob);

    try {
      return await this.loadImage(src);
    } finally {
      URL.revokeObjectURL(src);
    }
  }

  /**
   * Generates a cropped canvas element based on the current zoom and pan transformations
   * applied to the canvas element. The cropped image is returned as a data URL.
   *
   * @returns {HTMLCanvasElement} A html canvas element containing the image.
   */
  getCroppedCanvas() {
    const transform = d3.zoomTransform(this.canvasEl.value);

    const [width, height] = this._viewFinderDimensions;

    const p1 = transform.invert([0, 0]);
    const p2 = transform.invert([width, 0]);
    // const p3 = transform.invert([width, height]);
    const p4 = transform.invert([0, height]);

    const offsetX = minZero(Math.round(p1[0]));
    const offsetY = minZero(Math.round(p1[1]));

    const cropWidth = minZero(Math.floor(p2[0] - p1[0]));
    const cropHeight = minZero(Math.floor(p4[1] - p1[1]));

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    context.drawImage(
      this._sourceImageData,
      offsetX,
      offsetY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    );

    return canvas;
  }

  /**
   * Generates a cropped image from the canvas in the specified format and quality.
   *
   * @param {ImageFormat} [format=this.format] - The format of the image.
   * @param {number} [quality=this.quality] - The quality of the image (applicable for "jpeg" or "webp", range: 0 to 1).
   * @returns {string} A data URL containing the cropped image in the specified format and quality.
   */
  getCroppedImage(format = this.format, quality = this.quality) {
    const type = this.#getMimeType(format);

    const canvas = this.getCroppedCanvas(format, quality);

    return canvas.toDataURL(type, quality);
  }

  /**
   * Asynchronously generates a cropped image as a Blob object.
   *
   * @param {ImageFormat} [format=this.format] - The format of the image.
   * @param {number} [quality=this.quality] - The quality of the image (applicable for "jpeg" or "webp", range: 0 to 1).
   * @returns {Promise<Blob>} A promise that resolves to the cropped image as a Blob.
   * @throws {Error} If an error occurs while generating the Blob.
   */
  async getCroppedImageAsBlob(format = this.format, quality = this.quality) {
    const type = this.#getMimeType(format);

    const canvas = this.getCroppedCanvas(format, quality);

    const promise = new Promise((resolve, reject) => {
      try {
        canvas.toBlob(resolve, type, quality);
      } catch (error) {
        reject(error);
      }
    });

    const blob = await promise;

    return blob;
  }

  /**
   * Initiates a download of the cropped image with the specified options.
   *
   * @param {Object} [options={}] - Options for the cropped image download.
   * @param {string} [options.name="cropped-image"] - The name of the downloaded file (without extension).
   * @param {ImageFormat} [options.format=this.format] - The format of the image.
   * @param {number} [options.quality=this.quality] - The quality of the image (applicable for "jpeg" or "webp", range: 0 to 1).
   */
  downloadCroppedImage({
    name = 'cropped-image',
    format = this.format,
    quality = this.quality,
  } = {}) {
    const croppedImage = this.getCroppedImage(format, quality);
    const link = document.createElement('a');

    link.href = croppedImage;
    link.download = `${name}.${format}`;

    link.click();
  }

  /**
   * Copies the cropped image to the clipboard.
   *
   * @returns {Promise<void>} Resolves when the image has been successfully copied to the clipboard.
   * @throws {Error} If there is an issue generating the cropped image or copying it to the clipboard.
   */
  copyCroppedImage() {
    const blob = this.getCroppedImageAsBlob('png');

    return copyImageToClipboard('image/png', blob);
  }

  /**
   * Sets the zoom level to 1:1 and centers the view.
   */
  zoomToNormal() {
    this.resetZoom(1);
  }

  /**
   * Resets the zoom level of the canvas to an optional scalar value and centers the view.
   *
   * @param {number} [scalar=this._minZoom] - The zoom level to reset to. Defaults to the minimum zoom level.
   */
  resetZoom(scalar = this._minZoom) {
    const { sourceWidth, sourceHeight, _zoomBehaviour } = this;

    const $canvasEl = d3.select(this.canvasEl.value);

    _zoomBehaviour.scaleTo($canvasEl, scalar);

    _zoomBehaviour.translateTo(
      $canvasEl,
      sourceWidth / 2,
      sourceHeight / 2,
    );
  }

  /**
   * Retrieves the current image transformation parameters.
   *
   * @returns {ImageTransform} An object containing the image transformation properties:
   */
  getImageTransform() {
    const { k, x, y } = this._imageTransform;

    return { k, x, y };
  }

  /**
   * Sets the current image transformation parameters.
   *
   * @param {ImageTransform} transform - The transformation object.
   */
  setImageTransform({ k, x, y }) {
    const $canvasEl = d3.select(this.canvasEl.value);

    this._zoomBehaviour.transform($canvasEl, d3.zoomIdentity.translate(x, y).scale(k));
  }

  // --- lifecycle ---

  firstUpdated() {
    const rootResizeObserver = new ResizeObserver((entries) => {
      const { inlineSize: width, blockSize: height } =
        entries[0].contentBoxSize[0];
      this._rootDimensions = [width, height];
    });

    rootResizeObserver.observe(this.rootEl.value);

    const viewFinderResizeObserver = new ResizeObserver((entries) => {
      const { inlineSize: width, blockSize: height } =
        entries[0].contentBoxSize[0];
      this._viewFinderMaxDimensions = [width, height];
    });

    viewFinderResizeObserver.observe(this.viewFinderEl.value);

    const handleZoom = (event) => {
      this._imageTransform = event.transform;
    };

    this._zoomBehaviour = d3.zoom().on('zoom', handleZoom);

    d3.select(this.canvasEl.value).call(this._zoomBehaviour);
  }

  willUpdate(props) {
    if (props.has('src')) {
      this.loadImage(this.src);
    }

    if (props.has('_viewFinderMaxDimensions') || props.has('aspectRatio')) {
      this._viewFinderDimensions = this.#calculateViewFinderDimensions();
    }

    if (this._zoomBehaviour) {
      if (
        checkMapHasAnyKey(props, [
          '_sourceImageAspectRatio',
          '_viewFinderMaxDimensions',
          '_viewFinderDimensions',
          'aspectRatio',
          'maxZoom',
          'src',
        ])
      ) {
        const [width, height] = this._viewFinderDimensions;
        const { sourceWidth, sourceHeight } = this;

        if (!width || !height || !sourceWidth || !sourceHeight) return;

        const _minZoom = (this._minZoom = Math.max(
          width / sourceWidth,
          height / sourceHeight,
        ));

        this._zoomBehaviour
          .scaleExtent([_minZoom, this.maxZoom])
          .extent([
            [0, 0],
            [width, height],
          ])
          .translateExtent([
            [0, 0],
            [sourceWidth, sourceHeight],
          ]);

        this.resetZoom();
      }
    }

    if (props.has('_imageTransform')) {
      if (this.hasSourceImage) {
        this.onCrop(this.getCroppedCanvas());
      }
    }
  }

  // --- render

  render() {
    const transform = this.#imageTransform;

    return html`
      <div
        ${ref(this.rootEl)}
        class="easy-cropper"
        style=${styleMap({
          '--padding': this.padding ? this.padding + 'px' : undefined,
          '--view-finder--width': this.viewFinderWidth + 'px',
          '--view-finder--height': this.viewFinderHeight + 'px',
        })}
      >
        <svg
          class="canvas"
          ${ref(this.canvasEl)}
          width=${this.viewFinderWidth}
          height=${this.viewFinderHeight}
        >
          <g transform=${transform} transform-origin="0 0">
            <image
              ${ref(this.imageEl)}
              class="image"
              image-rendering=${ifDefined(
                this.noPixels ? undefined : 'pixelated',
              )}
            />
          </g>
        </svg>
        <div class="view-finder" ${ref(this.viewFinderEl)}>
          <easy-cropper-view-finder
            width=${this.viewFinderWidth}
            height=${this.viewFinderHeight}
          >
          </easy-cropper-view-finder>
        </div>
      </div>
    `;
  }

  // --- styles ---

  static styles = css`
    :host {
      --padding: 64px;
      --view-finder--dim-color: light-dark(
        hsla(0, 100%, 100%, 0.8),
        hsla(0, 0%, 0%, 0.8)
      );
      --view-finder--border-color: light-dark(
        hsla(0, 0%, 0%, 0.5),
        hsla(0, 100%, 100%, 0.5)
      );

      box-sizing: border-box;
      display: flex;
      position: absolute;
      inset: 0;

      *,
      *::after,
      *::before {
        box-sizing: inherit;
      }
    }

    .easy-cropper {
      align-items: stretch;
      display: flex;
      justify-content: stretch;
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .view-finder {
      flex: 1 1 auto;
      justify-content: center;
      align-items: center;
      display: flex;
      padding: var(--padding);
    }

    easy-cropper-view-finder {
      --border-color: var(--view-finder--border-color);

      position: absolute;
      pointer-events: none;
      box-shadow: 0 0 0 9999px var(--view-finder--dim-color);
    }

    .canvas {
      position: absolute;
      inset: var(--padding);
      left: 50%;
      top: 50%;
      transform: translate(
        calc(-1 * var(--view-finder--width) / 2),
        calc(-1 * var(--view-finder--height) / 2)
      );
      overflow: visible;
    }
  `;
}
