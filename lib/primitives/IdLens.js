"use strict";

var _ = require('lodash'),
    Lens = require('./../../src/base/Lens'),

    IdLens;

/**
 * The simplest possible `Lens`: operates on a single object; `get` returns the object and `map` applies a function to it
 * and returns the result.
 *
 * @type {Lens}
 */
IdLens = function () {
    return new Lens(
        _.identity,
        function (val, func) {
            return func(_.cloneDeep(val));
        }
    );
};

module.exports = IdLens;