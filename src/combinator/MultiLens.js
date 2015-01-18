"use strict";

var _ = require('lodash'),
    Lens = require('./../base/Lens'),

    get,
    map,

    MultiLens;

get = function (lenses) {
    return function (obj) {
        var gets;

        if (_.isArray(lenses)) {
            gets = [];

            _.forEach(lenses, function (lens) {
                gets.push(lens.get(obj));
            });
        } else {
            if (_.isObject(lenses)) {
                gets = {};

                _.forEach(_.keys(lenses), function (key) {
                    gets[key] = lenses[key].get(obj);
                });
            }
        }

        return gets;
    };
};

map = function (lenses) {
    return function (obj, func) {
        var newObj = _.cloneDeep(obj);

        if (_.isArray(lenses)) {
            _.forEach(lenses, function (lens) {
                newObj = lens.map(newObj, func);
            });
        } else {
            if (_.isObject(lenses)) {
                _.forEach(_.values(lenses), function (lens) {
                    newObj = lens.map(newObj, func);
                });
            }
        }
        return newObj;
    };
};

/**
 * A `MultiLens` is a `Lens` that can view on multiple things at once. It takes
 * an array of `Lens`es or an object with `Lens`es as values; `get`, `set` and `map`
 * run corresponding functions over the input object for each internal lens.
 *
 * @param {object|Array} lenses Lenses used to view on input objects.
 * @param {object} flags Additional flags to add to the Lens instance
 * @returns {MultiLens}
 * @constructor
 */
MultiLens = function (lenses, flags) {
    flags = flags || {};

    // Guard against no 'new'
    if (!this instanceof MultiLens) {
        return new MultiLens(lenses, flags);
    }

    flags._multi = true;

    if (_.isObject(lenses)) {
        _.forEach(_.keys(lenses), function (key) {
            if (!((lenses[key] instanceof Lens) || (lenses[key] instanceof MultiLens))) {
                throw new Error('Cannot construct MultiLens from non-lens');
            }
        });

        this._lenses = lenses;
    }

    if (_.isArray(lenses)) {
        _.forEach(lenses, function (lens) {
            if (!((lens instanceof Lens) || (lens instanceof MultiLens))) {
                throw new Error('Cannot construct MultiLens from non-lens');
            }
        });

        this._lenses = lenses;
    }

    this.base = Lens;
    this.base(get(lenses), map(lenses), flags);
};

MultiLens.prototype = new Lens;

/**
 * Add a new focus to this `Lens` by providing another `Lens` with which to focus with.
 *
 * @param otherLens The `Lens` to add to this `Lens`
 * @returns {MultiLens}
 */
MultiLens.prototype.add = function (otherLens) {
    var lenses = this._lenses,
        flags = this.getFlags();

    if (otherLens instanceof Lens) {
        flags = _.extend(flags, otherLens.getFlags());
    }

    if (_.isArray(lenses)) {
        lenses.push(otherLens);
    } else if (_.isObject(lenses)) {
        if (_.isObject(otherLens)) {
            // Assumes each value is a Lens
            _.forEach(_.values(otherLens), function (lens) {
                flags = _.extend(flags, lens.getFlags());
            });

            lenses = _.extend(lenses, otherLens);
        }
    }

    return new MultiLens(lenses, flags);
};

module.exports = MultiLens;