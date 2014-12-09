"use strict";

/**
 * A `Setter` is a `Lens` that doesn't support getting
 *
 * @type {exports}
 */
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

Setter = function (over, options) {
    var opts = { _setter: true};

    if (_.isObject(options)) {
        opts = _.extend(opts, options);
    }

    return new Lens(get, over, opts);
};

/**
 * Get a Setter from a Lens
 *
 * @param lens
 * @returns {Lens}
 */
Setter.fromLens = function (lens) {
    return new Setter(lens._over, lens.getOptions());
};

module.exports = Setter;