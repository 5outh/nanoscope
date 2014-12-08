"use strict";

var _ = require('lodash'),
    SliceLens = require('../src/array/SliceLens');

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

            _.forEach(_.zip(res, [1, 2, 3]), function (arr) {
                arr[0].should.equal(arr[1]);
            });
        });

        it('should get the first part of the list', function () {
            var lens = new SliceLens(':-1'),
                res = lens.get(testArr);

            res.length.should.equal(4);

            _.forEach(_.zip(lens.get(testArr), [1, 2, 3, 4]), function (arr) {
                arr[0].should.equal(arr[1]);
            });
        });

    });

    describe('#set', function () {

    });

    describe('#over', function () {

    });
});