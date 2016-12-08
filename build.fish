#! /usr/local/bin/fish

env NODE_PATH="src" watchify src/exports.js -o index.js -t [ babelify ]
