"use strict";

/**
 * Construct a lens that safely accesses and modifies parts of a structure.
 * For instance, if your object is:
 *
 * obj = { a : { b : 'c' } }
 *
 * then your path lens:
 *
 * pathLens = new PathLens('a.b.c.d');
 *
 * allows you to do things like:
 *
 * pathLens.get(obj) // undefined, even though it would throw an error elsewhere
 *
 * pathLens.set(obj, 9) // { a : { b : { c : { d : 9 } } } } // Sets obj.a.b.c.d even though it didn't exist before
 *
 * @type {exports}
 * @private
 */
var _ = require('lodash'),
    steelToe = require('steeltoe'),

    Lens = require('../lens'),

    get,
    over,

    PathLens;

/**
 * Safely get a value from a path (as an array or a dot-delimited string).
 *
 * @param path
 * @returns {Function}
 */
get = function (path) {
    return function (obj) {
        return steelToe(obj).get(path);
    };
};

/**
 * Map a function over a value gotten from some path in the object and return a new object.
 *
 * @param path
 * @returns {Function}
 */
over = function (path) {
    return function (obj, func) {
        var initialObj = obj,
            i;

        if (_.isString(path)) {
            path = path.split('.');
        } else if (!_.isArray(path)) {
            throw new Error('Path must either be an array or dot-separated string');
        }

        if (!obj) {
            obj = {};
        }

        // Traverse the path and get the value we want
        for (i = 0; i < path.length - 1; i++) {

            if (!(_.isObject(obj[path[i]]))) {
                obj[path[i]] = {};
            }

            obj = obj[path[i]];
        }

        // Set the value we care about
        obj[path[i]] = func(obj[path[i]]);

        // Return a clone of the object
        return _.cloneDeep(initialObj);
    };
};

/**
 * Construct a PathLens from a path
 *
 * @param path
 * @returns {Lens}
 * @constructor
 */
PathLens = function (path) {
    this._path = path;
    this._lens = new Lens(get(path), over(path));
    this._lens._path = path;

    return this._lens;
};

module.exports = PathLens;