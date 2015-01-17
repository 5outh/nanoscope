"use strict";

var _ = require('lodash'),
    Lens = require('../base/Lens'),
    FilterLens,

    get,
    map;

/**
 * Get the elements from an array satisfying a filtering function
 *
 * @param filter
 * @returns {Function}
 */
get = function (filter) {
    return function (arr) {
        if (_.isFunction(filter)) {
            // Return only the elements that are truthy from the filter function
            return _.filter(arr, filter);
        }

        if (_.isRegExp(filter)) {
            return _.filter(arr, function (elem) {
                return elem.match(filter);
            });
        }
    };
};

/**
 * Map the elements of an array satisfying a filtering function
 *
 * @param filter
 * @returns {Function}
 */
map = function (filter) {
    return function (arr, func) {
        // Only map elements that are truthy from the filter function
        return _.map(_.cloneDeep(arr), function (elem) {
            if (_.isFunction(filter)) {
                return filter(elem) ? func(elem) : elem;
            }

            if (_.isRegExp(filter)) {
                return elem.match(filter) ? func(elem) : elem;
            }
        });
    };
};

FilterLens = function (filter) {
    this.base = Lens;
    this.base(get(filter), map(filter), { _filter: filter });
};

// Add functions to Lens base

Lens.prototype.addFilter = function (filter) {
    return this.add(new FilterLens(filter));
};

Lens.prototype.composeFilter = function (filter) {
    return this.compose(new FilterLens(filter));
};

FilterLens.prototype = new Lens;

module.exports = FilterLens;