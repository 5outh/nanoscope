"use strict";

var SliceLens = require('../../src/SliceLens'),
    tailLens;

tailLens = new SliceLens(':-1');

module.exports = tailLens;