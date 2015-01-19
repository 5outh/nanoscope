"use strict";

var _ = require('lodash'),
    Lens = require('../base/Lens'),

    Optional;

/**
 * `Optional` `Lens`es take `Lens`es and an optional error handler as an argument, and make any `Lens` accesses safe.
 * For example, Using an unsafe `IndexedLens`, you may get an error if you try to access an element out of range:
 *
 * ```javascript
 * new IndexedLens(100).get([]) // Uh oh!
 * ```
 *
 * Using `Optional`, you can wrap the `IndexedLens` to return `null` (or optionally handle exceptions in some other way), e.g:
 *
 * ```javascript
 * var lens = new Optional(new IndexedLens(100));
 *
 * lens.get([]); // null
 * lens.get([], console.log); // prints 'Array index 100 out of range'
 * ```
 *
 * @param {Lens} lens The lens to make safe
 * @param {function|*} errorHandler A function that is called on any thrown exceptions,
 * or a default value to return on error.
 * @returns {Lens} A safer lens
 * @constructor
 */
Optional = function (lens, errorHandler) {
    var get = lens._get, map = lens._over;

    // Only overwrite get if the lens is not a setter (always throw the errors about missing functions)
    if (!(lens._setter)) {
        get = function (obj) {
            try {
                return lens.get(obj);
            } catch (ex) {
                if (_.isFunction(errorHandler)) {
                    return errorHandler(ex);
                }
                return errorHandler || null;
            }
        };
    }

    // Only overwrite set if the lens is not a getter (always throw the errors about missing functions)
    if (!(lens._getter)) {
        map = function (obj, func) {
            try {
                return lens.map(obj, func);
            } catch (ex) {
                if (_.isFunction(errorHandler)) {
                    return errorHandler(ex);
                }
                // Return original object if failing
                return errorHandler || obj;
            }
        };
    }

    this.base = Lens;
    this.base(get, map, _.extend(lens.getFlags(), { _optional: true }));
};

Optional.prototype = new Lens;

// Add stuff to base Lens

/**
 * Turns a Lens into an Optional Lens, catching errors with optional error handler
 *
 * @param errorHandler
 * @returns {Optional}
 */
Lens.prototype.catch = function (errorHandler) {
    if (errorHandler) {
        this._errorHandler = errorHandler;
    }

    return new Optional(this, errorHandler);
};

module.exports = Optional;