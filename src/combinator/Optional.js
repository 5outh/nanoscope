"use strict";

var _ = require('lodash'),
    Lens = require('../Lens'),

    Optional;

/**
 * Optional Lenses take Lenses and an optional error handler as an argument, and make any Lens accesses safe.
 *
 * @param {Lens} lens The lens to make safe
 * @param {function|*} errorHandler A function that is called on any thrown exceptions,
 * or a default value to return on error.
 * @returns {Lens} A safer lens
 * @constructor
 */
Optional = function (lens, errorHandler) {
    var get = lens._get, over = lens._over;

    // Only overwrite get if the lens is not a setter (always throw the errors about missing functions)
    if (!(lens._setter)) {
        get = function (obj) {
            try {
                return lens.get(obj);
            } catch (ex) {
                if (_.isFunction(errorHandler)) {
                    return errorHandler(ex);
                }
                return errorHandler;
            }
        };
    }

    // Only overwrite set if the lens is not a getter (always throw the errors about missing functions)
    if (!(lens._getter)) {
        over = function (obj, func) {
            try {
                return lens.over(obj, func);
            } catch (ex) {
                if (_.isFunction(errorHandler)) {
                    return errorHandler(ex);
                }
                return errorHandler;
            }
        };
    }

    this.base = Lens;
    this.base(get, over, _.extend(lens.getFlags(), { _optional: true }));
};

Optional.prototype = new Lens;

module.exports = Optional;