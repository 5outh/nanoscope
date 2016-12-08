#! /usr/local/bin/fish

env NODE_PATH="src" watchify index.js -o bundle.js -t [ babelify ]
