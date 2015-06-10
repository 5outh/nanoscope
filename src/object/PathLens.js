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

    Lens = require('../base/Lens'),

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
    if (_.isString(path)) {
        path = path.split('.');
    }

    return function (obj) {
        // Accumulation function to produce the final result
        var reduction = function (acc, key) {
            return unsafe ? acc[key] : (acc && acc[key] || null);
        };

        // Perform the reduction and return the result
        return _.reduce(path, reduction, obj);
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
    return function (previousObj, func) {
        var newObj = _.assign(previousObj),
            obj = newObj,
            modifiedStructure = false,
            value,
            i;

        if (_.isString(path)) {
            path = path.split('.');
        } else if (!_.isArray(path)) {
            throw new Error('Path must either be an array or dot-separated string');
        }

        // Only safeguard against empty object if using safe version
        if (!obj && !unsafe) {
            newObj = {};
            obj = newObj;
        }

        // Traverse the path and get the value we want
        for (i = 0; i < path.length - 1; i++) {

            // Only safeguard if not unsafe
            if (!(_.isObject(obj[path[i]])) && !unsafe) {
                value = func(obj[path[i]])

                if (value == null || (_.isNumber(value) && isNaN(value))) {
                    return _.clone(previousObj);
                }
                obj[path[i]] = {};
            }

            obj = obj[path[i]];
        }

        // Set the value we care about
        obj[path[i]] = func(obj[path[i]]);

        // Return a clone of the modified object
        return _.clone(newObj);
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
 * @returns {Lens}
 * @constructor
 * @param options
 */
PathLens = function (path, options) {
    var unsafe = options && options.unsafe,
        view = options && options._view,
        flags = { _path: path, _unsafePath: unsafe || false };

    if (view) {
        flags = _.extend(flags, { _view: view });
    }

    this.base = Lens;
    this.base(get(path, unsafe), map(path, unsafe), flags);
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
 * Construct an unsafe `PathLens` from a path (throws the usual errors)
 *
 * @param {string|Array} path The path to follow in an object
 * @constructor
 * @param options
 */
PathLens.Unsafe = function (path, options) {
    this.base = PathLens;
    this.base(path, _.extend({unsafe: true}, options));
};

PathLens.Unsafe.prototype = new PathLens;

// Add stuff to Lens base

/**
 * Add a path to a PathLens (safety preserved)
 *
 * @param path
 * @returns {*}
 * @param options
 */
Lens.prototype.addPath = function (path, options) {
    var unsafe = (options && options.unsafe) || this.getFlag('_unsafePath');

    return this.add(new PathLens(path, _.extend({unsafe: unsafe}, options)));
};

/**
 * Concatenate the path of this PathLens with another path (safety preserved)
 *
 * @param path
 * @returns {Compose}
 * @param options
 */
Lens.prototype.composePath = function (path, options) {
    var unsafe = (options && options.unsafe) || this.getFlag('_unsafePath');

    if (this.getFlag('_path')) {
        return new PathLens(
            this._flags._path + '.' + path,
            _.extend({unsafe: unsafe}, options)
        ).view(this._view);
    }

    return this.compose(new PathLens(path, _.extend({unsafe: unsafe}, options)));
};

/**
 * Aliases for composePath
 */
Lens.prototype.path = Lens.prototype.composePath;
Lens.prototype.following = Lens.prototype.composePath;

module.exports = PathLens;
