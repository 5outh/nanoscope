"use strict";

/**
 * A `Getter` is a `Lens` that doesn't support setting (or mapping over values)
 *
 * @type {exports}
 */
var Lens = require('./Lens'),

    Getter,

    over;

/**
 * Never allow `over` in a getter
 */
over = function () {
    throw new Error('over not permitted in a Getter');
};

Getter = function (get) {
    return new Lens(get, over, { _getter: true });
};

/**
 * Get a Getter from a Lens
 *
 * @param lens
 */
Getter.fromLens = function (lens) {
    return new Getter(lens._get);
};

module.exports = Getter;