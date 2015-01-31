"use strict";

var _ = require('lodash'),

    Lens = require('../base/Lens'),
    utils = require('./utils'),

    get,
    map,

    SliceLens;

/**
 * Get the slice of an array from `i` to `j`.
 *
 * @param {int} i The start of the slice
 * @param {int} j The end of the slice
 * @returns {Function}
 */
get = function (i, j) {
    return function (arr) {

        if (!_.isArray(arr)) {
            return [];
        }

        i = utils.normalizeIndex(arr, i);
        j = utils.normalizeIndex(arr, j);

        return arr.slice(i, j);
    };
};

/**
 * Map a function over a slice of an array and return the modified array.
 *
 * @param {int} i The start of the slice (may be negative)
 * @param {int} j The end of the slice (may be negative)
 * @returns {Function}
 */
map = function (i, j) {
    return function (arr, func) {
        var newArr = [],
            slicedArr,
            k;

        if (!_.isArray(arr)) {
            return _.cloneDeep(arr);
        }

        i = utils.normalizeIndex(arr, i);
        j = utils.normalizeIndex(arr, j);

        for (k = 0; k < i; k++) {
            newArr.push(arr[k]);
        }

        // Apply the function to the sliced array
        slicedArr = func(arr.slice(i, j));

        if (_.isArray(slicedArr)) {
            _.forEach(slicedArr, function (val) {
                newArr.push(val);
            });
        } else {
            // If the result isn't an array, replace the slice with that element
            newArr.push(slicedArr);
        }

        for (k = j; k < arr.length; k++) {
            newArr.push(arr[k]);
        }

        return newArr;
    };
};

/**
 * A `SliceLens` focuses on a slice of an array from starting and ending indices.
 * `SliceLenses` can be constructed in two ways:
 *
 * 1. By giving it integer start and end indices, which can be negative (negative indices start from the right)
 * 2. By passing in a Python-style string representing the slice, e.g. '0:-1'. By default, the starting index is set
 * to 0 and the ending index is set to arr.length, so for instance, new SliceLens(':') focuses on the whole list.
 *
 * @param {int|string} i The start of the slice or a string representing the slice, e.g. '0:-1"
 * @param {int} j The end of the Slice
 * @returns {SliceLens}
 * @constructor
 * @param options
 */
SliceLens = function (i, j, options) {
    var range,
        flags;

    if (_.isString(i)) {
        range = i.split(':');

        // "Array Copy" operator
        if (i === ":") {
            i = 0;
            j = undefined;
        } else {
            if (range[0] !== '') {
                i = Number(range[0]);
            } else {
                i = null;
            }

            if (range[1] !== '') {
                j = Number(range[1]);
            }
        }

    }

    if ((_.isUndefined(i) || _.isNull(i))
            && (_.isUndefined(j) || _.isNull(j))) {
        throw new Error('No slice indices defined.');
    }

    // Start from the beginning if start is not defined
    if (!i) {
        i = 0;
    }

    // NOTE: j not defined is handled by array.slice in both functions.

    flags = {
        _slice: {
            _start: i,
            _end: j
        }
    };

    this.base = Lens;
    this.base(get(i, j), map(i, j), _.extend(flags, options || {}));
};

SliceLens.prototype = new Lens;

// Add stuff to Lens base

/**
 * Add a slice to a Lens
 *
 * @param i
 * @param j
 * @param options
 * @returns {MultiLens}
 */
Lens.prototype.addSlice = function (i, j, options) {
    return this.add(new SliceLens(i, j, options));
};

/**
 * Compose a Lens with a slice
 *
 * @param i
 * @param j
 * @param options
 * @returns {Compose}
 */
Lens.prototype.composeSlice = function (i, j, options) {
    return this.compose(new SliceLens(i, j, options));
};

/**
 * Aliases for composeSlice
 */
Lens.prototype.slice = Lens.prototype.composeSlice;
Lens.prototype.slicing = Lens.prototype.composeSlice;

module.exports = SliceLens;