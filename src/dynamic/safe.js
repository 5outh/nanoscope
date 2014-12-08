"use strict";

var _ = require('lodash'),
    steelToe = require('steeltoe'),

    Lens = require('../lens'),

    get,
    over,

    PathLens;

get = function (path) {
    return function (obj) {
        return steelToe(obj).get(path);
    };
};

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