"use strict";

var _ = require('lodash'),
    nanoscope = require('../index'),
    IndexedLens = nanoscope.IndexedLens,
    Compose = nanoscope.Compose;

describe('Compose', function () {
    var testArr, compositeLens;

    beforeEach(function () {
        testArr = [0, [1], 2];

        // Should view arr[0][1]
        compositeLens = new Compose(
            new IndexedLens(1),
            new IndexedLens(0)
        );
    });

    describe('#get', function () {
        it('should return 1', function () {
            compositeLens.get(testArr).should.equal(1);
        });

        it('should fail when trying to get nonexistent value', function () {
            try {
                compositeLens.get([]);
            } catch (ex) {
                ex.message.should.equal('Argument to indexed lens must be an array');
            }
        });
    });

    describe('#set', function () {
        it('should return a new object with modified first element', function () {
            compositeLens.set(testArr, 9)[1][0].should.equal(9);
        });
    });

    describe('#map', function () {
        it('should multiply testArr[1][0] by 10', function () {
            compositeLens.map(testArr, function (attr) { return attr * 10; })[1][0].should.equal(10);
        });
    });
});