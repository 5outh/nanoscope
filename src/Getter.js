"use strict";

/**
 * A `Getter` is a `Lens` that doesn't support setting (or mapping over values)
 *
 * @type {exports}
 */
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
 * @param lens
 */
Getter.fromLens = function (lens) {
    return new Getter(lens._get, lens.getOptions());
};

module.exports = Getter;