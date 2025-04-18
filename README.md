# \<easy-cropper> `0.3.0`

This is an image crop web-component built using lit and d3-zoom.

## Without installation

```html
  <script type="module" src="https://esm.sh/easy-cropper"></script>

  <easy-cropper aspectRatio="16:9" src="my-image.jpg"></easy-cropper>
```

## Installation

Install the easy-cropper package

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
`aspectRatio`          | String  | 1:1                        | The aspect ratio to be cropped. Can be either a value or an equation like 16:9.
`format`               | String  | png (png\|jpg\|jpeg\|webp) | The format of the output image to be generated.
`maxZoom`              | Number  | 5                          | The maximum zoom level allowed.
`padding`              | Number  |                            | The padding around the view-finder.
`noPixels`             | Boolean | false                      | Whether to display interpolated pixels when the image is zoomed in or not.
`quality`              | Number  | 1.0 (0.0 - 1.0)            | A number indicating the image quality if the format is `jpeg` or `webp`.
`src`                  | String  |                            | The source URL of the image to be cropped.

## Getters

### hasSourceImage

Getter to check if a source image is available.

```javascript
element.hasSourceImage;
```

### height

Gets the height of the root element.

```javascript
element.height;
```

### sourceAspectRatio

Gets the aspect ratio of the source image.
Returns a `number` or `undefined` if no source image is set.

```javascript
element.sourceAspectRatio;
```

### sourceHeight

Gets the height of the source image data.
Returns a `number` or `undefined` if no source image is set.

```javascript
element.sourceHeight;
```

### sourceWidth

Gets the width of the source image data.
Returns a `number` or `undefined` if no source image is set.

```javascript
element.sourceWidth;
```

### viewFinderHeight

Gets the height of the view-finder.

```javascript
element.viewFinderHeight;
```

### viewFinderWidth

Gets the width of the view-finder.

```javascript
element.viewFinderWidth;
```

### width

Gets the width of the root element.

```javascript
element.width;
```

### zoomExtent

Gets the zoom extent for the crop area.

```javascript
element.zoomExtent;
```


## Methods

### loadImage(src)

Loads the specified image or data-url.

```javascript
element.loadImage("my-image.jpg");
```


### getCroppedCanvas()

Returns a HTMLCanvasElement to be used as a preview for the cropped area.

```javascript
element.getCroppedCanvas();
```


### getCroppedImage(format = this.format, quality = this.quality)

Returns the cropped images as data-url.

```javascript
element.getCroppedImage("jpg", 0.8);
```


### downloadCroppedImage({ name = "cropped-image", format = "png", quality = 1.0 })

Initiates a download of the cropped image with the specified options.

```javascript
element.downloadCroppedImage({ name: "my-image", format: "jpg", quality: 0.8 });
```


### copyCroppedImage()

Copies the cropped image to the clipboard in the "image/png" format.

```javascript
await element.copyCroppedImage();
```


### zoomToNormal()

Sets the zoom level to 1:1 and centers the view.

```javascript
element.zoomToNormal();
```


### resetZoom(scalar = minZoom)

Resets the zoom level of the canvas to an optional scalar value and centers the view.

```javascript
element.resetZoom();
```


### getImageTransform()

Retrieves the current image transformation parameters.

```javascript
const transform = element.getImageTransform();
```


### setImageTransform({ k, x, y })

Sets the image transformation parameters and ensures the viewport remains constrained.

```javascript
element.setTransform(transform);
```


## Examples

There are examples provided in the [examples](./examples) folder.

## License

`<easy-cropper>` is distributed under the [MIT License](./LICENSE).
