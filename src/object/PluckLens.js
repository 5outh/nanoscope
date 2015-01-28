"use strict";

var _ = require('lodash'),

    Lens = require('../base/Lens'),
    PluckLens,

    get,
    map;

/**
 * Pluck properties of an object based on regular expression, an array of properties or filtering function.
 *
 * @param plucker
 * @param recursive
 * @param object
 * @returns {Function}
 */
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

                // Run a function over the property and its value
                if (plucker(property, viewedObject[property])) {
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

/**
 * Map plucked properties of an object based on regular expression, an array of properties or filtering function.
 *
 * @param plucker
 * @param recursive
 * @param object
 * @returns {Function}
 */
map = function (plucker, recursive, object) {
    return function (viewedObject, func) {

        if (_.isUndefined(object)) {
            object = _.cloneDeep(viewedObject);
        }

        _.forEach(_.keys(viewedObject), function (property) {

            if (_.isRegExp(plucker)) {

                if (property.match(plucker)) {
                    object[property] = func(viewedObject[property]);
                }

            } else if (_.isArray(plucker)) {

                if (_.contains(plucker, property)) {
                    object[property] = func(viewedObject[property]);
                }

            } else if (_.isFunction(plucker)) {

                if (plucker(property, viewedObject[property])) {
                    object[property] = func(viewedObject[property]);
                }

            } else {
                throw new Error('Plucker must be one of: Regex, Array, or Function');
            }

            if (recursive && _.isObject(viewedObject[property])) {
                map(plucker, recursive, object[property])(viewedObject[property], func);
            }
        });

        return object;
    };
};

/**
 * A PluckLens is a Lens that focuses only on specified properties of an object, based on one of:
 *
 * - An array of specific properties to pluck,
 * - A Regular Expression,
 * - or a filtering function that is run on each property (plucks properties for which the filter returns true)
 *
 * @param plucker
 * @param recursive
 * @constructor
 */
PluckLens = function (plucker, options) {
    var recursive = options && options.recursive,
        view = options && options._view,
        flags = { _pluck: plucker, _recursive: recursive || false };

    if (view) {
        flags._view = view;
    }

    this.base = Lens;
    this.base(get(plucker, recursive), map(plucker, recursive), flags);
};

PluckLens.prototype = new Lens;

/**
 * Pluck all the way down, instead of just on the top-level of an object.
 *
 * @param plucker
 * @returns {PluckLens}
 * @constructor
 */
PluckLens.Recursive = function (plucker, options) {
    return new PluckLens(plucker, _.extend({recursive: true}, options));
};

/**
 * Add a Pluck to a Lens (preserves recursive, but can be specified in options)
 *
 * @param plucker
 * @returns {MultiLens}
 * @param options
 */
Lens.prototype.addPluck = function (plucker, options) {
    var recursive = (options && options.recursive) || this.getFlag('_recursivePluck');

    return this.add(new PluckLens(plucker, _.extend({recursive: recursive}, options)));
};

/**
 * Compose a Lens with a Pluck (preserves recursive, but can be specified in options)
 *
 * @param plucker
 * @returns {Compose}
 * @param options
 */
Lens.prototype.composePluck = function (plucker, options) {
    var recursive = (options && options.recursive) || this.getFlag('_recursivePluck');

    return this.compose(new PluckLens(plucker, _.extend({recursive: recursive}, options)));
};

/**
 * Aliases for composePluck
 */
Lens.prototype.pluck = Lens.prototype.composePluck;
Lens.prototype.plucking = Lens.prototype.composePluck;

module.exports = PluckLens;