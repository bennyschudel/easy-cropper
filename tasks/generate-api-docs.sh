#!/bin/sh

npx jsdoc \
  --destination pages/dist/docs/api \
  --readme docs/api/README.md \
  src/EasyCropper.js \
  src/EasyCropperViewFinder.js
