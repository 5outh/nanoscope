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

    Lens = require('../Lens'),

    get,
    over,

    getPaths,

    PathLens;

/**
 * Safely get a value from a path (as an array or a dot-delimited string).
 *
 * @param {string|Array} path Array or dot-delimited string describing a path to follow in an object
 * @param {boolean} unsafe If true, fails if element at path doesn't exist
 * @returns {Function}
 */
get = function (path, unsafe) {
    if (!unsafe) {
        // Just use steelToe to safely access element
        return function (obj) {
            return steelToe(obj).get(path);
        };
    }

    // If unsafe, split the path and follow it without regard for errors.
    if (_.isString(path)) {
        path = path.split('.');
    }

    return function (obj) {
        console.log(path);
        _.forEach(path, function (key) {
            obj = obj[key];
        });

        return obj;
    };
};

/**
 * Map a function over a value gotten from some path in the object and return a new object.
 *
 * @param {string|Array} path Array or dot-delimited string describing a path to follow in an object
 * @param {boolean} unsafe If true, fails if element at path doesn't exist
 * @returns {Function}
 */
over = function (path, unsafe) {
    return function (obj, func) {
        var prevObj = _.cloneDeep(obj),
            initialObj = obj,
            i;

        if (_.isString(path)) {
            path = path.split('.');
        } else if (!_.isArray(path)) {
            throw new Error('Path must either be an array or dot-separated string');
        }

        // Only safeguard against empty object if using safe version
        if (!obj && !unsafe) {
            obj = {};
        }

        // Traverse the path and get the value we want
        for (i = 0; i < path.length - 1; i++) {

            // Only safeguard if not unsafe
            if (!(_.isObject(obj[path[i]])) && !unsafe) {
                obj[path[i]] = {};
            }

            obj = obj[path[i]];
        }

        // Set the value we care about
        obj[path[i]] = func(obj[path[i]]);

        // If the value doesn't exist and we're not setting anything, return a clone of the previous object
        // This prevents turning, for example, {} into { a: { b : { ... z: undefined } ... } }
        if (!(obj[path[i]])) {
            return prevObj;
        }

        // Return a clone of the modified object
        return _.cloneDeep(initialObj);
    };
};

/**
 * Construct a PathLens from a path
 *
 * @param {string|Array} path Array or dot-delimited string describing a path to follow in an object
 * @param {boolean} unsafe If true, construct an unsafe version of
 * @returns {Lens}
 * @constructor
 */
PathLens = function (path, unsafe) {
    this.base = Lens;
    this.base(get(path, unsafe), over(path, unsafe), { _path: path });
};

PathLens.prototype = new Lens;

/**
 * Helper function for building all paths in an object
 *
 * @param prefix
 * @param obj
 * @param paths
 * @returns {*}
 * @private
 */
getPaths = function (prefix, obj, paths) {
    if (!paths) {
        paths = [];
    }

    _.forEach(_.keys(obj), function (key) {
        var nextPrefix;

        if (!prefix) {
            nextPrefix = key;
        } else {
            nextPrefix = prefix + '.' + key;
        }

        paths.push(nextPrefix);

        if (_.isObject(obj[key])) {
            paths = getPaths(nextPrefix, obj[key], paths);
        }
    });

    return paths;
};

/**
 * Derive lenses for every path in an object
 *
 * @param obj
 */
PathLens.deriveLenses = function (obj) {
    var lenses = {};

    _.forEach(getPaths(null, obj), function (path) {
        lenses[path] = new PathLens(path);
    });

    return lenses;
};

/**
 * Construct an unsafe PathLens from a path
 *
 * @param path
 * @constructor
 */
PathLens.Unsafe = function (path) {
    this.base = PathLens;
    this.base(path, true);
};

PathLens.Unsafe.prototype = new PathLens;

module.exports = PathLens;