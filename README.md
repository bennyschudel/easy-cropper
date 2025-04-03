# \<easy-cropper>

This is an image crop web-component built using lit and d3-zoom.

## Without installation

```html
  <script type="module" src="https://esm.sh/lit"></script>
  <script type="module" src="https://esm.sh/d3-zoom"></script>
  <script type="module" src="https://esm.sh/easy-cropper"></script>

  <easy-cropper aspectRatio="1.777"></easy-cropper>
```

## Installation

Install the Crop-it! package

```bash
npm install easy-cropper
```

## Usage

### Minimal example
```js
  import 'easy-cropper';

  <easy-cropper></easy-cropper>
```

## Attributes

There are a few attributes that could be set.

attribute-name         | type    | default value              | description
--------------         | ----    | -------------              | -----------
`aspectRatio`          | Number  | 1.0                        | The aspect ratio to be cropped.
`format`               | String  | png (png\|jpg\|jpeg\|webp) | The format of the output image to be generated.
`maxZoom`              | Number  | 5                          | The maximum zoom level allowed.
`padding`              | Number  | 64                         | The padding around the view-finder.
`noPixels`             | Boolean | false                      | Whether to display interpolated pixels when the image is zoomed in or not.
`quality`              | Number  | 1.0 (0 - 1.0)              | A number indicating the image quality if the format is "jpeg" or "webp".
`src`                  | String  |                            | The source URL of the image to be cropped.

## Methods

### loadImage(src)
```javascript
element.loadImage("my-image.jpg");
```

Loads the specified image or data-url.

### getCroppedCanvas()
```javascript
element.getCroppedCanvas();
```

Returns a HTMLCanvasElement to be used as a preview for the cropped area.


### getCroppedImage(format = this.format, quality = this.quality)
```javascript
element.getCroppedImage("jpg", 0.8);
```

Returns the cropped images as data-url.

### downloadCroppedImage({ name = "cropped-image", format = "png", quality = 1.0 })
```javascript
element.downloadCroppedImage({ name: "my-image", format: "jpg", quality: 0.8 });
```

Initiates a download of the cropped image with the specified options.

### zoomToNormal()
```javascript
element.zoomToNormal();
```

Sets the zoom level to 1:1.Resets the zoom level of the canvas to an optional scalar value and centers the view.

### resetZoom(scalar = minZoom)
```javascript
element.resetZoom();
```

Resets the zoom level of the canvas to an optional scalar value and centers the view.

## Examples

There are examples provided in the [examples](./examples) folder.

## License

`<easy-cropper>` is distributed under the [MIT License](./LICENSE).
