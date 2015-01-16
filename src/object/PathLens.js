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
    map,

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
map = function (path, unsafe) {
    return function (obj, func) {
        var prevObj = _.cloneDeep(obj),
            initialObj = obj,
            modifiedStructure = false,
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
                modifiedStructure = true;
            }

            obj = obj[path[i]];
        }

        // Set the value we care about
        obj[path[i]] = func(obj[path[i]]);

        // If the value doesn't exist and we're not setting anything, return a clone of the previous object
        // This prevents turning, for example, {} into { a: { b : { ... z: undefined } ... } }
        // NOTE: == null catches null OR undefined values. This is on purpose.
        if ((obj[path[i]] == null) && modifiedStructure) {
            return prevObj;
        }

        // Return a clone of the modified object
        return _.cloneDeep(initialObj);
    };
};

/**
 * A `PathLens` is a `Lens` that focuses on some element following a path in a JS object. They are safe by default
 * and will not throw errors when trying to get or set elements that don't exist. In regular javascript, for example:
 *
 * ```javascript
 * {}.a.b; // Throws 'cannot read property b of undefined'
 * ```
 *
 * But with a `PathLens`:
 *
 * ```javascript
 * new PathLens('a.b').get(); // null
 * ```
 *
 * You can also set values that don't exist yet:
 *
 * ```javascript
 * new PathLens('a.b').set({}, 100); // {a : { b : 100 } }
 * ```
 *
 * Unsafe `PathLenses` don't catch these errors and will throw the usual error messages. These can be constructed using
 * either the `PathLens.Unsafe` constructor or by setting the unsafe parameter in the `PathLens` constructor to `true`.
 *
 * @param {string|Array} path Array or dot-delimited string describing a path to follow in an object
 * @param {boolean} unsafe If true, construct an unsafe version of
 * @returns {Lens}
 * @constructor
 */
PathLens = function (path, unsafe) {
    this.base = Lens;
    this.base(get(path, unsafe), map(path, unsafe), { _path: path, _unsafe: unsafe || false });
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

        if (_.isObject(obj[key]) && !_.isArray(obj[key])) {
            paths = getPaths(nextPrefix, obj[key], paths);
        }
    });

    return paths;
};

/**
 * `deriveLenses` derives `PathLens`es for every existent path in the object passed in.
 * For example, if you have the following structure:
 *
 * ```javascript
 * var obj = { a: { b : { c : 8, d: 9 } } }
 * ```
 *
 * `PathLens.deriveLenses(obj)` gives back an object with the following keys:
 *
 * `'a', 'a.b', 'a.b.c', and 'a.b.d'`.
 *
 * Each of these keys point to a safe `PathLens` for that path.
 *
 * @param {object} obj The object to derive lenses from
 */
PathLens.deriveLenses = function (obj) {
    var lenses = {};

    _.forEach(getPaths(null, obj), function (path) {
        lenses[path] = new PathLens(path);
    });

    return lenses;
};

/**
 * Add a path to a PathLens (safety preserved)
 *
 * @param path
 * @returns {*}
 */
PathLens.prototype.addPath = function (path) {
    return this.add(new PathLens(path, this.getFlag('_unsafe')));
};

/**
 * Concatenate the path of this PathLens with another path (safety preserved)
 *
 * @param path
 * @returns {Compose}
 */
PathLens.prototype.composePath = function (path) {
    return this.compose(new PathLens(path, this.getFlag('_unsafe')));
};

/**
 * Construct an unsafe `PathLens` from a path (throws the usual errors)
 *
 * @param {string|Array} path The path to follow in an object
 * @constructor
 */
PathLens.Unsafe = function (path) {
    this.base = PathLens;
    this.base(path, true);
};

PathLens.Unsafe.prototype = new PathLens;

module.exports = PathLens;