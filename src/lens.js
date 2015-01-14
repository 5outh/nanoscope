"use strict";

var _ = require('lodash'),
    Lens;

/**
 * A `Lens` is a construct that allows you to 'peer into' some structure and operate on sub-parts of it. A `Lens` supports
 * three basic operations:
 *
 * 1. `get`, which takes an object and gets a piece of it,
 * 2. `map`, which takes an object and maps a function over it, and
 * 3. `set`, which takes an object and sets it to some value.
 *
 * To construct a `Lens`, you must provide both a `get` function and an `map` function. `set` is a special case of `map`, so you
 * don't need to explicitly define it.
 *
 * As a simple example, the following constructs a `Lens` that focuses on the first element of an array:
 *
 * ```javascript
 * var headLens = new Lens (
 *     function (arr) { return arr[0]; },
 *     function (arr, func) {
 *         var newArr = _.deepClone(arr); // Lenses should operate on immutable data, don't modify original array
 *         newArr[0] = func(newArr[0]); // Apply a user-specified function to the head of the array and set the first element
 *         return newArr; // Return the modified array
 *     }
 * );
 * ```
 *
 * Any user-constructed lenses are expected to obey the Lens laws, as follows:
 *
 * 1. set-get (you get what you put in): `lens.get(a, lens.set(a, b)) = b`
 * 2. get-set (putting what is there doesn't change anything): `lens.set(a, lens.get(a)) = a`
 * 3. set-set (setting twice is the same as setting once): `lens.set(c, lens.set(b, a)) = lens.set(c, a)`
 *
 * These laws ensure that the getting and setting behavior make sense in the usual way.
 *
 * @param {function} get Get the value you want from the structure
 * @param {function} map Map a function map the value and return the modified structure
 * @param {object} flags Additional properties to add to `Lens` if specified
 * @returns {Lens}
 * @constructor
 */
Lens = function (get, map, flags) {
    var self = this;

    // guard against no `new`
    if (!(self instanceof Lens)) {
        return new Lens(get, map, flags);
    }

    self._flags = flags || {};
    self._get = get;
    self._over = map;

    return self;
};

/**
 * Get the value this `Lens` focuses on from an object
 *
 * @param {*} obj The object to run the `Lens` on
 * @returns {*}
 */
Lens.prototype.get = function (obj) {
    return this._get(obj || this._view);
};

/**
 * Run a function over the view of the `Lens` and return the modified structure
 *
 * @param {*} obj The object to run the `Lens` on
 * @param {function} func The function to call on the view of the Lens
 * @returns {Lens}
 */
Lens.prototype.map = function (obj, func) {
    // If a view exists and a second argument isn't provided, use the view.
    if (this._view && !func) {
        return this._over(this._view, obj);
    }

    return this._over(obj, func);
};

/**
 * Set the view of the `Lens` to something new and return the modified structure
 *
 * @param {*} obj The object to run the Lens on
 * @param {*} val The value to set
 * @returns {Lens}
 */
Lens.prototype.set = function (obj, val) {
    // If a view exists, and a second argument isn't provided, set the view.
    if (this._view && !val) {
        return this._over(this._view, _.constant(obj));
    }

    return this._over(obj, _.constant(val));
};


/**
 * Force the `Lens` to `view` a new object
 *
 * @param {*} view The object to view a Lens on
 * @return {Lens} this
 */
Lens.prototype.view = function (view) {
    this._view = view;
    return this;
};

/**
 * Reset the view of the `Lens`.
 *
 * @return {Lens} this
 */
Lens.prototype.blur = function () {
    this._view = null;
    return this;
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
 * Get a specific flag from a Lens
 *
 * @param flag
 * @returns {*}
 */
Lens.prototype.getFlag = function (flag) {
    return this._flags.flag;
};

/**
 * Add a flag to the Lens
 *
 * @param {*} flag
 */
Lens.prototype.addFlag = function (flag) {
    this._flags = _.extend(this._flags, flag);
};

/**
 * Compose this lens with another `Lens`
 *
 * @param {Lens} otherLens The `Lens` to compose this one with
 * @returns {Compose}
 */
Lens.prototype.compose = function (otherLens) {
    var Compose = require('./Compose');
    return new Compose(this, otherLens, _.extend(this.getFlags(), otherLens.getFlags()));
};

/**
 * Compose this lens with many other Lenses, specified by an array in which to order them.
 *
 * @param otherLenses
 * @returns {Lens}
 */
Lens.prototype.composeMany = function (otherLenses) {
    var args = arguments,
        lens = this;

    // Support variable length args
    if (args.length > 1) {
        otherLenses = args;
    }

    _.forEach(otherLenses, function (otherLens) {
        lens = lens.compose(otherLens);
    });

    return lens;
};

/**
 * Add a new focus to this `Lens` by providing another `Lens` with which to focus with.
 *
 * @param otherLens The `Lens` to add to this `Lens`
 * @returns {MultiLens}
 */
Lens.prototype.add = function (otherLens) {
    var MultiLens = require('./MultiLens');

    return new MultiLens([this, otherLens], _.extend(this.getFlags(), otherLens.getFlags()));
};

/**
 * Add many new focuses to this `Lens` by providing an array of other lenses to focus with.
 *
 * @param otherLenses
 * @returns {Lens}
 */
Lens.prototype.addMany = function (otherLenses) {
    var args = arguments,
        lens = this;

    // Support variable length args
    if (args.length > 1) {
        otherLenses = args;
    }

    _.forEach(otherLenses, function (otherLens) {
        lens = lens.add(otherLens);
    });

    return lens;
};

module.exports = Lens;