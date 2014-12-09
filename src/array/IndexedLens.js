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
 * @param index
 * @returns {Function}
 */
get = function (index) {
    return function (arr) {
        index = utils.normalizeIndex(arr, index);

        if (!(_.isArray(arr))) {
            throw new Error('Argument to indexed lens must be an array');
        }

        // Only allow updates if array element exists or is the next element in the array
        if (utils.isValidIndex(arr, index)) {
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

        index = utils.normalizeIndex(arr, index);

        if (!(_.isArray(newArr))) {
            throw new Error('Argument to indexed lens must be an array');
        }

        // Only allow updates if array element exists or is the next element in the array
        if (utils.isValidIndex(arr, index)) {
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
    this._lens = new Lens(
        get(index),
        over(index),
        { _index: index }
    );

    return this._lens;
};

/**
 * Derive all indexed lenses for an array and return them in an object
 *
 * @param arr
 * @returns {{}}
 */
IndexedLens.deriveLenses = function(arr) {
    var lenses = [];

    _.forEach(_.range(arr.length), function (index) {
        lenses[index] = new IndexedLens(index);
    });

    return lenses;
};


module.exports = IndexedLens;