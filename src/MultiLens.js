"use strict";

var _ = require('lodash'),
    Lens = require('./Lens'),

    MultiLens;

MultiLens = function (lenses, options) {
    // Guard against no 'new'
    if (!this instanceof MultiLens) {
        return new MultiLens(lenses, options);
    }

    _.forEach(_.keys(options), function (key) {
        this[key] = options[key];
    });

    this._multi = true;

    if (_.isObject(lenses)) {
        _.forEach(_.keys(lenses), function (key) {
            if (!((lenses[key] instanceof Lens) || (lenses[key] instanceof MultiLens))) {
                throw new Error('Cannot construct MultiLens from non-lens');
            }
        });

        this._lenses = lenses;
    }

    if (_.isArray(lenses)) {
        _.forEach(lenses, function (lens) {
            if (!((lens instanceof Lens) || (lens instanceof MultiLens))) {
                throw new Error('Cannot construct MultiLens from non-lens');
            }
        });

        this._lenses = lenses;
    }

    return this;
};

MultiLens.prototype.get = function (obj) {
    var lenses = this._lenses,
        gets;

    console.log(lenses);

    if (_.isArray(lenses)) {
        gets = [];

        _.forEach(lenses, function (lens) {
            gets.push(lens.get(obj));
        });
    } else {
        if (_.isObject(lenses)) {
            gets = {};

            _.forEach(_.keys(lenses), function (key) {
                gets[key] = lenses[key].get(obj);
            });
        }
    }

    return gets;
};

MultiLens.prototype.over = function (obj, func) {
    var newObj = _.deepClone(obj);

    if (_.isArray(this._lenses)) {
        _.forEach(this._lenses, function (lens) {
            newObj = lens.over(newObj, func);
        });
    }

    if (_.isObject(this._lenses)) {
        _.forEach(_.values(this._lenses), function (lens) {
            newObj = lens.over(newObj, func);
        });
    }

    return newObj;
};

MultiLens.prototype.set = function (obj, val) {
    this.over(obj, _.constant(val));
};

module.exports = MultiLens;