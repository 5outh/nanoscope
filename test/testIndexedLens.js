"use strict";

var _ = require('lodash'),
    IndexedLens = require('../src/dynamic/IndexedLens');

describe('IndexedLens', function () {
    var testArr, testLens;

    beforeEach(function () {
        testArr = [1, 2, 3];
        testLens = new IndexedLens(0);

    });

    describe('#get', function () {
        it('should return 1', function () {
            testLens.get(testArr).should.equal(1);
        });
    });

    describe('#set', function () {
        it('should return a new object with modified first element', function () {
            testLens.set(testArr, 9)[0].should.equal(9);
        });

        it('should add a property even if it isnt there', function () {
            var lens = new IndexedLens(4);

            lens.set(testArr, 4)[4].should.equal(4);
        });
    });

    describe('#over', function () {
        it('should multiply testArr[0] by 10', function () {
            testLens.over(testArr, function (attr) { return attr * 10; })[0].should.equal(10);
        });
    });
});