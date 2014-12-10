"use strict";

var _ = require('lodash'),
    Lens;

/**
 * Construct a new lens from a `get` function and an `over` function
 *
 * @param {function} get Get the value you want from the structure
 * @param {function} over Map a function over the value and return the modified structure
 * @param {object} flags Additional properties to add to `Lens` if specified
 * @returns {Lens}
 * @constructor
 */
Lens = function (get, over, flags) {
    var self = this;

    // guard against no `new`
    if (!(self instanceof Lens)) {
        return new Lens(get, over, flags);
    }

    self._flags = flags || {};
    self._get = get;
    self._over = over;

    return self;
};

/**
 * Get any extra set options in a Lens
 *
 * @returns {*}
 */
Lens.prototype.getFlags = function () {
    return this._flags;
};

/**
 * Get the value this Lens focuses on from an object
 *
 * @param {*} obj The object to run the Lens on
 * @returns {*}
 */
Lens.prototype.get = function (obj) {
    return this._get(obj);
};

/**
 * Run a function over the focus of the Lens and return the modified structure
 *
 * @param {*} obj The object to run the Lens on
 * @param {function} func The function to call on the focus of the Lens
 * @returns {Lens}
 */
Lens.prototype.over = function (obj, func) {
    return this._over(obj, func);
};

/**
 * Set the focus of the Lens to something new and return the modified structure
 *
 * @param {*} obj The object to run the Lens on
 * @param {*} val The value to set
 * @returns {Lens}
 */
Lens.prototype.set = function (obj, val) {
    return this._over(obj, _.constant(val));
};

module.exports = Lens;