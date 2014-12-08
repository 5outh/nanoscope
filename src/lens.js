"use strict";

var _ = require('lodash'),
    Lens;


Lens = function (get, over, obj) {

    this._get = get;
    this._over = over;

    // Optional
    this._object = obj;

    return this;
};

Lens.prototype.get = function (obj) {
    return this._get(obj || this._object);
};

Lens.prototype.over = function (obj, func) {
    return this._over(obj || this._object, func);
};

Lens.prototype.set = function (obj, val) {
    return this._over(obj || this._object, _.constant(val));
};

module.exports = Lens;