"use strict";

var IndexedLens = require('../../src/array/IndexedLens'),
    headLens;

// A headLens is just an `IndexedLens` with index 0.
headLens = new IndexedLens(0);

module.exports = headLens;