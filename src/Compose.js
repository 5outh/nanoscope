"use strict";

var Lens = require('./Lens'),
    get,
    map;

get = function (lensA, lensB) {
    return function (obj) {
        return lensB.get(lensA.get(obj));
    };
};

map = function (lensA, lensB) {
    return function (obj, func) {
        return lensA.map(
            obj,
            function () {
                return lensB.map(lensA.get(obj), func);
            }
        );
    };
};

/**
 * Create the composite of two `Lens`es. For instance, to create a `Lens` for `arr[i][j]`:
 *
 * ```javascript
 * arrIJLens = new Compose(
 *     new IndexedLens(1),
 *     new IndexedLens(0)
 * );
 * ```
 *
 * Then `arrIJLens.get`, `.set`, and `.map` first call the appropriate function for the first `Lens`, then
 * the appropriate function for the second `Lens` and return the result.
 *
 * @param {Lens} lensA The first `Lens` to call functions on
 * @param {Lens} lensB The second `Lens` to call functions on
 * @returns {Compose}
 * @constructor
 */
var Compose = function (lensA, lensB) {
    this.base = Lens;
    this.base(get(lensA, lensB), map(lensA, lensB), { _lensA: lensA, _lensB: lensB });
};

Compose.prototype = new Lens;

module.exports = Compose;