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
};

nanoscope.prototype.index = function (index, options) {
    return new IndexedLens(index, _.extend({ _view: this._view }, options));
};

nanoscope.prototype.unsafeIndex = function (index, options) {
    return new IndexedLens.Unsafe(index, _.extend({ _view: this._view }, options));
};

nanoscope.prototype.slice = function (i, j, options) {
    return new SliceLens(i, j, _.extend({ _view: this._view }, options));
};

module.exports = nanoscope;