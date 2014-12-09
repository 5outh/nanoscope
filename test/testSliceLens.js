"use strict";

var _ = require('lodash'),
    SliceLens = require('../src/array/SliceLens'),
    utils = require('./utils');

describe('SliceLens', function () {
    describe('#SliceLens', function () {
        it('should create a slice lens with the right properties', function () {
            var lens = new SliceLens(0, 5);

            lens.should.have.properties({
                _slice: {
                    _start: 0,
                    _end: 5
                }
            });
        });

        it('should create a slice lens with the right properties with string constructor', function () {
            var lens = new SliceLens('0:5');

            lens.should.have.properties({
                _slice: {
                    _start: 0,
                    _end: 5
                }
            });
        });

        it('should create a slice lens with the right properties with negative indices', function () {
            var lens = new SliceLens('0:-1');

            lens.should.have.properties({
                _slice: {
                    _start: 0,
                    _end: -1
                }
            });
        });

        it('should create a slice lens with the right properties with partially defined slice from left', function () {
            var lens = new SliceLens('1:');

            lens.should.have.properties({
                _slice: {
                    _start: 1,
                    _end: undefined
                }
            });
        });

        it('should create a slice lens with the right properties with partially defined slice from right', function () {
            var lens = new SliceLens(':1');

            lens.should.have.properties({
                _slice: {
                    _start: 0,
                    _end: 1
                }
            });
        });


        it('should create a slice lens with the right properties with : constructor', function () {
            var lens = new SliceLens(':');

            lens.should.have.properties({
                _slice: {
                    _start: 0,
                    _end: undefined
                }
            });
        });
    });

    describe('#get', function () {
        var testArr;

        beforeEach(function () {
            testArr = [1, 2, 3, 4, 5];
        });

        it('should get the correct slice', function () {
            var lens = new SliceLens(0, 3),
                res = lens.get(testArr);

            res.length.should.equal(3);

            utils.testArrayEquals(res, [1, 2, 3]);
        });

        it('should get the first part of the list', function () {
            var lens = new SliceLens(':-1'),
                res = lens.get(testArr);

            res.length.should.equal(4);

            utils.testArrayEquals(res, [1, 2, 3, 4]);
        });

    });

    describe('#set', function () {
        var testArr;

        beforeEach(function () {
            testArr = [1, 2, 3, 4, 5];
        });

        it('should set the first two elements of the list to 100', function () {
            var lens = new SliceLens(':2'),
                res;

            res = lens.set(testArr, [100, 100]);

            res.length.should.equal(5);

            utils.testArrayEquals(res, [100, 100, 3, 4, 5]);
        });

        it('should cut out the last element of the list', function () {
            var lens = new SliceLens('-1:'),
                res = lens.set(testArr, []);

            res.length.should.equal(4);

            utils.testArrayEquals(res, [1, 2, 3, 4]);
        });
    });

    describe('#over', function () {
        var testArr;

        beforeEach(function () {
            testArr = [1, 2, 3, 4, 5];
        });

        it('should square the last two elements of the list', function () {
            var lens = new SliceLens('-2:'),
                res;

            res = lens.over(testArr, function (arr) {
                return _.map(arr, function (val) { return Math.pow(val, 2); });
            });

            utils.testArrayEquals(res, [1, 2, 3, 16, 25]);
        });

        it('should return the length of the list', function () {
            var lens = new SliceLens('0:'),
                res;

            res = lens.over(testArr, function (arr) {
                return [arr.length];
            });

            res[0].should.equal(5);
        });
    });
});