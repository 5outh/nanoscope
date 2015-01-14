"use strict";

var _ = require('lodash'),
    IndexedLens = require('../../src/array/IndexedLens'),
    lastLens;

// lastLens is just an IndexedLens that indexes on the last element.
lastLens = new IndexedLens(-1);

module.exports = lastLens;