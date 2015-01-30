"use strict";

var _ = require('lodash'),

    Lens = require('../base/Lens'),
    utils = require('./utils'),

    IndexedLens,

    get,
    map;

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
            if (unsafe) {
                throw new Error('Argument to indexed lens must be an array');
            }
            return null;
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
 * Index must be in the interval `[0, array.length]` (inclusive); i.e. you may only modify existing elements or
 * add an element to the end.
 *
 * @param {int} index The index to map over
 * @returns {Function} The map function required to construct a Lens
 * @param {boolean} unsafe If true, throw an error if index isn't valid.
 */
map = function (index, unsafe) {
    return function (arr, func) {
        var newArr = _.cloneDeep(arr);

        index = utils.normalizeIndex(arr, index);

        if (!(_.isArray(newArr))) {
            if (unsafe) {
                throw new Error('Argument to indexed lens must be an array');
            }
            // Identity is sort of the 'null' for map
            return newArr;
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
 * An `IndexedLens` is a `Lens` that focuses on some index of an array.
 *
 * @param {int} index The index to view on
 * @returns {Lens}
 * @constructor
 * @param options
 */
IndexedLens = function (index, options) {
    var unsafe = options && options.unsafe,
        view = options && options._view,
        flags = { _index: index, _unsafeIndex: unsafe || false };

    if (view) {
        flags = _.extend(flags, { _view: view });
    }

    this.base = Lens;

    this.base(
        get(index, unsafe),
        map(index, unsafe),
        flags
    );
};

IndexedLens.prototype = new Lens;

/**
 * Construct an Unsafe `IndexedLens` that throws errors when attempting to access
 * elements that are out of bounds.
 *
 * @param {int} index index The index to view on
 * @returns {Lens}
 * @constructor
 * @param options
 */
IndexedLens.Unsafe = function (index, options) {
    this.base = IndexedLens;
    this.base(index, {unsafe: true, _view: options && options._view});
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

// Add stuff to Lens base

/**
 * Add an Index to a Lens
 *
 * @param index
 * @returns {MultiLens}
 */
Lens.prototype.addIndex = function (index) {
    return this.add(new IndexedLens(index, { unsafe: this.getFlag('_unsafeIndex') }));
};

/**
 * Compose a lens with an IndexedLens
 *
 * @param index
 * @returns {Compose}
 */
Lens.prototype.composeIndex = function (index) {
    return this.compose(new IndexedLens(index, { unsafe: this.getFlag('_unsafeIndex') }));
};

// Aliases for `composeIndex`
Lens.prototype.index = Lens.prototype.composeIndex;
Lens.prototype.indexing = Lens.prototype.composeIndex;

module.exports = IndexedLens;