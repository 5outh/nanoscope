"use strict";

var _ = require('lodash'),
    Lens = require('./Lens'),

    IdLens;

/**
 * The simplest possible Lens: operates on a single object; get returns the object and over applies a function to it.
 *
 * @type {Lens}
 */
IdLens = function () {
    return new Lens(
        _.identity,
        function (val, func) {
            return func(val);
        }
    );
};

module.exports = IdLens;