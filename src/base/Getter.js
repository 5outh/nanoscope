"use strict";

var _ = require('lodash'),
    Lens = require('./Lens'),

    Getter,

    map;

/**
 * Never allow `map` in a getter
 */
map = function () {
    throw new Error('map not permitted in a Getter');
};

/**
 * A `Getter` is a `Lens` that doesn't support setting or mapping over values. A `Getter` is constructed using only a
 * `get` function, which returns the element (or elements) the `Lens` should view on.
 *
 * @param {function} get Function to allow access to an object via this lens.
 * @param {object} options Additional flags to set in the resulting Lens
 * @returns {Getter}
 * @constructor
 */
Getter = function (get, options) {
    var opts = { _getter: true};

    if (_.isObject(options)) {
        opts = _.extend(opts, options);
    }

    this.base = Lens;
    this.base(get, map, opts);
};

Getter.prototype = new Lens;

/**
 * Construct a `Getter` from a `Lens` by overwriting its map and set functions.
 *
 * @param {Lens} lens The `Lens` to convert to a `Getter`.
 */
Getter.fromLens = function (lens) {
    return new Getter(lens._get, lens.getFlags());
};

// Add function to Lens base

Lens.prototype.getter = function () {
    return Getter.fromLens(this);
};

module.exports = Getter;