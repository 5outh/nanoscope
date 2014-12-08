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
    return function (func, obj) {
        var i;

        if (_.isString(path)) {
            path = path.split('.');
        } else if (!_.isArray(path)) {
            throw new Error('Path must either be an array or dot-separated string');
        }

        // Traverse the path and get the value we want
        for (i = 0; i < path.length - 1; i++) {
            if (obj) {
                obj = obj[path[i]];
            }
        }

        // Set the value we care about
        if (obj[path[i]]) {
            obj[path[i]] = func(obj[path[i]]);
        }

        // Return a clone of the object
        return _.cloneDeep(obj);
    };
};

PathLens = Lens(get, over);

module.exports = PathLens;