"use strict";

var _ = require('lodash'),
    nanoscope = require('../index'),
    FilterLens = nanoscope.FilterLens,
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
        it('should get the even elements with a filter function', function () {
            var lens = new FilterLens(function (elem) {
                return (elem % 2 === 0);
            });

            utils.testArrayEquals(lens.view([1, 2, 3, 4, 5, 6]).get(), [2, 4, 6]);
        });

        it('should get the alpha elements with a filter regex', function () {
            var lens = new FilterLens(/^[a-zA-Z]*$/);

            utils.testArrayEquals(lens.view(['abc', 'abD', 'a8b', '889']).get(), ['abc', 'abD']);
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

        it('should map only the alpha elements with a filter regex', function () {
            var lens = new FilterLens(/^[a-zA-Z]*$/);

            utils.testArrayEquals(
                lens.view(['abc', 'abD', 'a8b', '889']).map(function (str) {
                    return str.toUpperCase();
                }),
                ['ABC', 'ABD', 'a8b', '889']
            );
        });
    });

    describe('#addFilter', function () {
        var abLens = new FilterLens(/^[a-b]*$/),
            lens =abLens.addFilter(/^[b-c]*$/),
            arr = ['ab', 'aab', 'bbc', 'cbdb', 'ddc'];

        it('should give back a list of filtered stuff', function () {
            expect(lens.view(arr).get()).to.eql([
                ['ab', 'aab'],
                ['bbc']
            ]);
        });
    });

    describe('#composeFilter', function () {
        var abLens = new FilterLens(/^[a-b]*$/),
            lens =abLens.composeFilter(/^[b-c]*$/),
            arr = ['ab', 'bc', 'bbc', 'bc', 'bbb'];

        it('should return a list of things that match both filters', function () {
            expect(lens.view(arr).get()).to.eql(['bbb']);
        });
    });
});