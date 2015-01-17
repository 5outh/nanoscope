"use strict";

var _ = require('lodash'),

    Lens = require('./base/Lens'),

    // Predefined Lenses
    IndexedLens = require('./array/IndexedLens'),
    SliceLens = require('./array/SliceLens'),
    PathLens = require('./object/PathLens'),
    FilterLens = require('./array/FilterLens'),
    PluckLens = require('./object/PluckLens'),

    // Composite Lenses
    Compose = require('./combinator/Compose'),
    Optional = require('./combinator/Optional'),
    MultiLens = require('./combinator/MultiLens'),

    // Special Cases
    Getter = require('./base/Getter'),
    Setter = require('./base/Setter'),

    nanoscope,
    unsafe;

nanoscope = function (view) {

    // nanoscope shouldn't be thought of as a class, but is one.
    // So, don't require `new` keyword on construction.
    if (!(this instanceof nanoscope)) {
        return new nanoscope(view);
    }

    this._view = view;
    this._lens = null;
};

nanoscope.prototype.index = function (index, options) {
    this._lens = new IndexedLens(index, _.extend({ _view: this._view }, options));

    return this;
};

nanoscope.prototype.unsafeIndex = function (index, options) {
    this._lens = new IndexedLens.Unsafe(index, _.extend({ _view: this._view }, options));

    return this;
};

nanoscope.prototype.get = function () {
    return this._lens.get.apply(this._lens, arguments);
};

nanoscope.prototype.map = function () {
    return this._lens.map.apply(this._lens, arguments);
};

nanoscope.prototype.set = function () {
    return this._lens.set.apply(this._lens, arguments);
};

module.exports = nanoscope;