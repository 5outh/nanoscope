"use strict";

var _ = require('lodash'),
    Lens = require('../Lens'),
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
        // Return only the elements that are truthy from the filter function
        return _.filter(arr, filter);
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
            return filter(elem) ? func(elem) : elem;
        });
    };
};

FilterLens = function (filter) {
    this.base = Lens;
    this.base(get(filter), map(filter), { _filter: filter });
};

FilterLens.prototype = new Lens;

module.exports = FilterLens;