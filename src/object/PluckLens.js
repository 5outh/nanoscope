"use strict";

var _ = require('lodash'),

    Lens = require('../Lens'),
    PluckLens,

    get,
    map;

get = function (plucker, recursive, object) {
    if (_.isUndefined(object)) {
        object = {};
    }

    return function (viewedObject) {
        _.forEach(_.keys(viewedObject), function (property) {

            if (_.isRegExp(plucker)) {

                if (property.match(plucker)) {
                    object[property] = viewedObject[property];
                }

            } else if (_.isArray(plucker)) {

                if (_.contains(plucker, property)) {
                    object[property] = viewedObject[property];
                }

            } else if (_.isFunction(plucker)) {

                if (plucker(property)) {
                    object[property] = viewedObject[property];
                }

            } else {
                throw new Error('Plucker must be one of: Regex, Array, or Function');
            }

            if (recursive && _.isObject(viewedObject[property])) {

                if (object.hasOwnProperty(property)) {
                    object[property] = {};
                }

                get(plucker, recursive, object[property])(viewedObject[property]);
            }
        });

        return object;
    };
};

map = function (plucker, recursive) {
    return function (obj, func) {
        return obj;
    };
};

PluckLens = function (plucker, recursive) {
    // Clean up flag
    if (!recursive) {
        recursive = false;
    }

    this.base = Lens;
    this.base(get(plucker, recursive), map(plucker, recursive), { _pluck: plucker, _recursive: recursive });
};

PluckLens.prototype = new Lens;

PluckLens.Recursive = function (plucker) {
    return new PluckLens(plucker, true);
};

module.exports = PluckLens;