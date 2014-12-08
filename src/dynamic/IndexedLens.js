"use strict";

var _ = require('lodash'),

    Lens = require('../Lens'),

    IndexedLens,

    isValidIndex,
    normalizeIndex,

    get,
    over;

/**
 * Checks if the index being accessed is allowed to be accessed
 *
 * @param arr
 * @param index
 * @returns {boolean}
 */
isValidIndex = function (arr, index) {
    return index >= 0 && index <= arr.length;
};

/**
 * Normalize a negative index to pull from the end of an array.
 *
 * @param arr
 * @param index
 * @returns {*}
 */
normalizeIndex = function (arr, index) {
    if (index < 0) {
        return arr.length + index;
    }
    return index;
};

/**
 * Get the element at a specific index of an array
 *
 * @param index
 * @returns {Function}
 */
get = function (index) {
    return function (arr) {
        index = normalizeIndex(arr, index);

        if (!(_.isArray(arr))) {
            throw new Error('Argument to indexed lens must be an array');
        }

        // Only allow updates if array element exists or is the next element in the array
        if (isValidIndex(arr, index)) {
            return arr[index];
        }

        return null;
    };
};

/**
 * Map a function over the value at some index in an array.
 * Index must be in the interval [0, array.length] (inclusive); i.e. you may only modify existing elements or
 * add an element to the end.
 *
 * @param index
 * @returns {Function}
 */
over = function (index) {
    return function (arr, func) {
        var newArr = _.cloneDeep(arr);

        index = normalizeIndex(arr, index);

        if (!(_.isArray(newArr))) {
            throw new Error('Argument to indexed lens must be an array');
        }

        // Only allow updates if array element exists or is the next element in the array
        if (isValidIndex(arr, index)) {
            newArr[index] = func(newArr[index]);
        } else {
            throw new Error('Array index ' + index + ' out of range.');
        }

        return newArr;
    };
};

/**
 * Construct an IndexedLens from an index
 *
 * @param index
 * @returns {Lens}
 * @constructor
 */
IndexedLens = function (index) {
    this._lens = new Lens(get(index), over(index), { _index: index });

    return this._lens;
};

/**
 * Set the index of an IndexedLens
 *
 * @param index
 * @returns {IndexedLens}
 */
IndexedLens.prototype.setIndex = function (index) {
    return new IndexedLens(index);
};

module.exports = IndexedLens;