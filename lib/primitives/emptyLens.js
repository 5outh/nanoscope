"use strict";

var Lens = require('../../src/Lens'),

    get,
    map,
    emptyLens;

get = function () {
    return null;
};

map = function () {
    return null;
};

emptyLens = new Lens(get, map);