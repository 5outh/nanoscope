"use strict";

var Lens = require('../Lens'),
    get,
    over;

get = function (lensA, lensB) {
    return function (obj) {
        return lensB.get(lensA.get(obj));
    };
};

over = function (lensA, lensB) {
    return function (obj, func) {
        return lensA.over(
            obj,
            function () {
                return lensB.over(lensA.get(obj), func);
            }
        );
    };
};

/**
 * Create the composite of two `lens`es. For instance, to create a lens for arr[i][j]:
 *
 * arrIJLens = new Compose(
 *     new IndexedLens(1),
 *     new IndexedLens(0)
 * );
 *
 * Then arrIJLens.get, .set, and .over all work as you'd expect.
 *
 * @param lensA
 * @param lensB
 * @returns {Compose}
 * @constructor
 */
var Compose = function (lensA, lensB) {
    this.base = Lens;
    this.base(get(lensA, lensB), over(lensA, lensB), { _lensA: lensA, _lensB: lensB });
};

Compose.prototype = new Lens;

module.exports = Compose;