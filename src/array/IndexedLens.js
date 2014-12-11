"use strict";

var _ = require('lodash'),

    Lens = require('../Lens'),
    utils = require('./utils'),

    IndexedLens,

    get,
    over;

/**
 * Get the element at a specific index of an array
 *
 * @param {int} index The index to get
 * @returns {Function} The get function required to construct a Lens
 * @param {boolean} unsafe If true, throw an error if index is invalid
 */
get = function (index, unsafe) {
    return function (arr) {
        index = utils.normalizeIndex(arr, index);

        if (!(_.isArray(arr))) {
            throw new Error('Argument to indexed lens must be an array');
        }

        // Only allow updates if array element exists
        if (utils.isValidIndex(arr, index + 1)) {
            return arr[index];
        }

        if (unsafe) {
            throw new Error('Attempt to access invalid index ' + index);
        }

        return null;
    };
};

/**
 * Map a function over the value at some index in an array.
 * Index must be in the interval [0, array.length] (inclusive); i.e. you may only modify existing elements or
 * add an element to the end.
 *
 * @param {int} index The index to map over
 * @returns {Function} The over function required to construct a Lens
 * @param {boolean} unsafe If true, throw an error if index isn't valid.
 */
over = function (index, unsafe) {
    return function (arr, func) {
        var newArr = _.cloneDeep(arr);

        index = utils.normalizeIndex(arr, index);

        if (!(_.isArray(newArr))) {
            throw new Error('Argument to indexed lens must be an array');
        }

        // Only allow updates if array element exists or is the next element in the array
        if (utils.isValidIndex(arr, index)) {
            newArr[index] = func(newArr[index]);
        } else {
            // Only throw error if unsafe
            if (unsafe) {
                throw new Error('Array index ' + index + ' out of range');
            }
        }

        return newArr;
    };
};

/**
 * An IndexedLens is a Lens that focuses on some index of an array.
 *
 * @param {int} index The index to focus on
 * @param {boolean} unsafe If true, throws errors when index is out of range.
 * @returns {Lens}
 * @constructor
 */
IndexedLens = function (index, unsafe) {
    this.base = Lens;
    this.base(get(index, unsafe), over(index, unsafe), { _index: index });
};

IndexedLens.prototype = new Lens;

/**
 * Construct an Unsafe IndexedLens that throws errors when attempting to access
 * elements that are out of bounds.
 *
 * @param {int} index index The index to focus on
 * @returns {Lens}
 * @constructor
 */
IndexedLens.Unsafe = function (index) {
    this.base = IndexedLens;
    this.base(index, true);
};

IndexedLens.Unsafe.prototype = new IndexedLens;

/**
 * Derive all indexed lenses for an array and return them in an array
 *
 * @param {Array} arr The array to derive Lenses from
 * @returns {Array} An array of Lenses focusing on each index of arr
 */
IndexedLens.deriveLenses = function (arr) {
    var lenses = [];

    _.forEach(_.range(arr.length), function (index) {
        lenses[index] = new IndexedLens(index);
    });

    return lenses;
};


module.exports = IndexedLens;