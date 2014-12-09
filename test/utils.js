"use strict";

var _ = require('lodash'),

    testArrayEquals;

testArrayEquals = function (arrA, arrB) {
    _.forEach(_.zip(arrA, arrB), function (arr) {
        arr[0].should.equal(arr[1]);
    });
};

module.exports = {
    testArrayEquals: testArrayEquals
};