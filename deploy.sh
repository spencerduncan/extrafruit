#! /bin/bash

git checkout master
npm run build
git checkout gh-pages
rm -rdf static/
rm asset-manifest.json favicon.ico index.html manifest.json service-worker.js
cp -rd build/* .
git add *

