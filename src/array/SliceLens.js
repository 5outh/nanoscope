"use strict";

var _ = require('lodash'),

    Lens = require('../Lens'),
    utils = require('./utils'),

    get,
    over,

    SliceLens;

/**
 * Get the slice of an array from i to j.
 *
 * @param i
 * @param j
 * @returns {Function}
 */
get = function (i, j) {
    return function (arr) {

        i = utils.normalizeIndex(arr, i);
        j = utils.normalizeIndex(arr, j);

        return arr.slice(i, j);
    };
};

/**
 * Map a function over a slice of an array and return the modified array.
 *
 * @param i
 * @param j
 * @returns {Function}
 */
over = function (i, j) {
    return function (arr, func) {
        var newArr = [],
            slicedArr,
            k;

        i = utils.normalizeIndex(arr, i);
        j = utils.normalizeIndex(arr, j);

        for (k = 0; k < i; k++) {
            newArr.push(arr[k]);
        }

        // Apply the function to the sliced array
        slicedArr = func(arr.slice(i, j));

        _.forEach(slicedArr, function (val) {
            newArr.push(val);
        });

        for (k = j; k < arr.length; k++) {
            newArr.push(arr[k]);
        }

        return newArr;
    };
};

/**
 * Build a slice lens from start and end of range parameters.
 *
 * @param i
 * @param j
 * @returns {Lens|*}
 * @constructor
 */
SliceLens = function (i, j) {
    var range;

    if (_.isString(i)) {
        range = i.split(':');

        if (range[0] !== '') {
            i = Number(range[0]);
        } else {
            i = null;
        }

        if (range[1]) {
            j = Number(range[1]);
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

    return new Lens(
        get(i, j),
        over(i, j),
        {
            _slice : {
                _start: i,
                _end: j
            }
        }
    );
};

module.exports = SliceLens;