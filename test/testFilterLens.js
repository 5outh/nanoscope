"use strict";

var _ = require('lodash'),
    FilterLens = require('../src/array/FilterLens'),
    utils = require('./utils');

describe('FilterLens', function () {
    describe('#FilterLens', function () {
        it('should create a slice lens with the right flags', function () {
            var lens = new FilterLens(_.identity);

            lens.should.have.properties({
                _flags: {
                    _filter: _.identity
                }
            });
        });
    });

    describe('#get', function () {
        it('should get the even elements', function () {
            var lens = new FilterLens(function (elem) {
                return (elem % 2 === 0);
            });

            utils.testArrayEquals(lens.view([1, 2, 3, 4, 5, 6]).get(), [2, 4, 6]);
        });
    });

    describe('#map', function () {
        it('should double the even elements', function () {
            var lens = new FilterLens(function (elem) {
                return (elem % 2 === 0);
            });

            utils.testArrayEquals(
                lens.view([1, 2, 3, 4, 5, 6]).map(function (elem) { return elem * 2; }),
                [1, 4, 3, 8, 5, 12]
            );
        });
    });
});