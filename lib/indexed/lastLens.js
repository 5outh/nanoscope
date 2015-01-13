"use strict";

var _ = require('lodash'),
    Lens = require('../../src/Lens'),
    lastLens,

    get,
    set;

get = function (arr) {
    return arr[arr.length - 1];
};

set = function (arr, val) {
    var newArr = _.cloneDeep(arr);

    newArr[arr.length - 1] = val;

    return newArr;
};

lastLens = new Lens(get, set);

module.exports = lastLens;