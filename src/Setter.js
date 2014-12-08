"use strict";

/**
 * A `Setter` is a `Lens` that doesn't support getting
 *
 * @type {exports}
 */
var Lens = require('lens'),

    Setter,

    get;

/**
 * Never allow `get` in a setter
 */
get = function () {
    throw new Error('get not permitted in a Setter');
};

Setter = function (over) {
    return new Lens(get, over, { _setter: true });
};

module.exports = Setter;