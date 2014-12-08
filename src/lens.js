"use strict";

var _ = require('lodash'),
    Lens;

/**
 * Construct a new lens from a `get` function and an `over` function
 *
 * @param get Get the value you want from the structure
 * @param over Map a function over the value and return the modified structure
 * @returns {Lens}
 * @constructor
 * @param options Additional properties to add to `Lens` if specified
 */
Lens = function (get, over, options) {
    var self = this;

    // guard against no `new`
    if (!(self instanceof Lens)) {
        return new Lens(get, over, options);
    }

    self._get = get;
    self._over = over;

    // Add additional properties to `Lens` if specified
    if (_.isObject(options)) {
        _.forEach(_.keys(options), function (key) {
            self[key] = options[key];
        });
    }

    return self;
};

/**
 * Get the value this Lens focuses on from an object
 *
 * @param obj The object to run the Lens on
 * @returns {*}
 */
Lens.prototype.get = function (obj) {
    return this._get(obj);
};

/**
 * Run a function over the focus of the Lens and return the modified structure
 *
 * @param obj The object to run the Lens on
 * @param func The function to call on the focus of the Lens
 * @returns {*}
 */
Lens.prototype.over = function (obj, func) {
    return this._over(obj, func);
};

/**
 * Set the focus of the Lens to something new
 *
 * @param obj The object to run the Lens on
 * @param val The value to set
 * @returns {*}
 */
Lens.prototype.set = function (obj, val) {
    return this._over(obj, _.constant(val));
};

module.exports = Lens;