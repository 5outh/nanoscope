"use strict";

var SliceLens = require('../../src/array/SliceLens'),
    tailLens;

tailLens = new SliceLens(':-1');

module.exports = tailLens;