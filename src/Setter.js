"use strict";

var _ = require('lodash'),
    Lens = require('./Lens'),

    Setter,

    get;

/**
 * Never allow `get` in a setter
 */
get = function () {
    throw new Error('get not permitted in a Setter');
};

/**
 * A `Setter` is a `Lens` that only supports setting and mapping. A `Setter` is constructed with a single function (`over`).
 *
 * @param {function} over Function that maps over the view of the Lens and returns the result.
 * @param {object} options Additional flags to set in the Lens.
 * @returns {Lens}
 * @constructor
 */
Setter = function (over, options) {
    var opts = { _setter: true};

    if (_.isObject(options)) {
        opts = _.extend(opts, options);
    }

    this.base = Lens;
    this.base(get, over, opts);
};

Setter.prototype = new Lens;

/**
 * Get a `Setter` from a `Lens`
 *
 * @param {Lens} lens The Lens to convert to a `Setter`
 * @returns {Lens}
 */
Setter.fromLens = function (lens) {
    return new Setter(lens._over, lens.getFlags());
};

module.exports = Setter;