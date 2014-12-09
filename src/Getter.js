"use strict";

var _ = require('lodash'),
    Lens = require('./Lens'),

    Getter,

    over;

/**
 * Never allow `over` in a getter
 */
over = function () {
    throw new Error('over not permitted in a Getter');
};

/**
 * A `Getter` is a `Lens` that doesn't support setting (or mapping over values)
 *
 * @param {function} get Function to allow access to an object via this lens.
 * @param {object} options Additional flags to set in the resulting Lens
 * @returns {Lens}
 * @constructor
 */
Getter = function (get, options) {
    var opts = { _getter: true};

    if (_.isObject(options)) {
        opts = _.extend(opts, options);
    }

    return new Lens(get, over, opts);
};

/**
 * Get a Getter from a Lens
 *
 * @param {Lens} lens The lens to convert to a Getter.
 */
Getter.fromLens = function (lens) {
    return new Getter(lens._get, lens.getOptions());
};

module.exports = Getter;