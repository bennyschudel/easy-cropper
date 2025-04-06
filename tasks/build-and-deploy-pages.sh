#!/bin/sh

cd pages

npm run build

cd ..

npm run docs:api

cd pages

npm run deploy

cd ..
