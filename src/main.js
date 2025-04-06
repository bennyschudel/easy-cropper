import { EasyCropperViewFinder } from './EasyCropperViewFinder.js';

import { EasyCropper } from './EasyCropper.js';

export {
  EasyCropperViewFinder,
  // ---
  EasyCropper,
};

// ---

window.customElements.define('easy-cropper-view-finder', EasyCropperViewFinder);

window.customElements.define('easy-cropper', EasyCropper);
