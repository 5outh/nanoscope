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

FilterLens = function (filter, options) {
    this.base = Lens;
    this.base(get(filter), map(filter), _.extend({ _filter: filter }, options));
};

// Add functions to Lens base

/**
 * Add a filter to a Lens
 *
 * @param filter
 * @returns {MultiLens}
 */
Lens.prototype.addFilter = function (filter) {
    return this.add(new FilterLens(filter));
};

/**
 * Compose a Lens with a filter
 *
 * @param filter
 * @returns {Compose}
 */
Lens.prototype.composeFilter = function (filter) {
    return this.compose(new FilterLens(filter));
};

/**
 * Aliases for composeFilter
 */
Lens.prototype.filter = Lens.prototype.composeFilter;
Lens.prototype.filtering = Lens.prototype.composeFilter;

FilterLens.prototype = new Lens;

module.exports = FilterLens;