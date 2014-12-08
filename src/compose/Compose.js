"use strict";

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
    this._lensA = lensA;
    this._lensB = lensB;

    return this;
};

Compose.prototype.get = function (obj) {
    try {
        return this._lensB.get(this._lensA.get(obj));
    } catch (ex) {
        console.log("Warning: " + ex.message);
    }

    return null;
};

Compose.prototype.over = function (obj, func) {
    var self = this;

    try {
        return self._lensA.over(
            obj,
            function () {
                return self._lensB.over(self._lensA.get(obj), func);
            }
        );
    } catch (ex) {
        console.log("Warning: " + ex.message);
    }
    return null;
};

Compose.prototype.set = function (obj, val) {
    try {
        return this._lensA.set(
            obj,
            this._lensB.set(this._lensA.get(obj), val)
        );
    } catch (ex) {
        console.log("Warning: " + ex.message);
    }
    return null;
};

module.exports = Compose;