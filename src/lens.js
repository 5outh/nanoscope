"use strict";

var _ = require('lodash'),
    Lens;

/**
 * A Lens is a construct that allows you to 'peer into' some structure and operate on subparts of it. A Lens supports
 * three basic operations:
 *
 * 1. get, which takes an object and gets a piece of it,
 * 2. over, which takes an object and maps a function over it, and
 * 3. set, which takes an object and sets it to some value.
 *
 * To construct a lens, you must provide both a get function and an over function. Set is a special case of over, so you
 * don't need to explicitly define it.
 *
 * As a simple example, the following constructs a lens that focuses on the first element of an Array:
 *
 * var headLens = new Lens (
 *     function (arr) { return arr[0]; },
 *     function (arr, func) {
 *         var newArr = _.deepClone(arr); // Lenses should operate on immutable data, don't modify original array
 *         newArr[0] = func(newArr[0]); // Apply a user-specified function to the head of the array and set the first element
 *         return newArr; // Return the modified array
 *     }
 * )
 *
 * Any user-constructed lenses are expected to obey the "lens laws":
 *
 * 1. set-get (you get what you put in): lens.get(a, lens.set(a, b)) = b
 * 2. get-set (putting what is there doesn't change anything): lens.set(a, lens.get(a)) = a
 * 3. set-set (setting twice is the same as setting once):  lens.set(c, lens.set(b, a)) = lens.set(c, a)
 *
 * Poring over these definitions for a minute should allow you to see *why* they exist and *why* they matter. These laws
 * ensure that the getting and setting behavior make sense in the usual way.
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