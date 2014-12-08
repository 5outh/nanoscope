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

        it('should add an element at the end of the array', function () {
            var lens = new IndexedLens(3);

            lens.set(testArr, 3)[3].should.equal(3);
        });

        it('should set the last element of the list when using a negative index', function () {
            var lens = new IndexedLens(-1);

            lens.set(testArr, 100)[2].should.equal(100);
        });

        it('should fail if trying to set a negative element that is too large', function () {
            var lens = new IndexedLens(-100);

            try {
                lens.set(testArr, 100);
            } catch (ex) {
                ex.message.should.equal('Array index -97 out of range.');
            }
        });

        it('should fail if trying to set an element that is too large', function () {
            var lens = new IndexedLens(5);

            try {
                lens.set(testArr, 3);
            } catch (ex) {
                ex.message.should.equal('Array index 5 out of range.');
            }
        });
    });

    describe('#over', function () {
        it('should multiply testArr[0] by 10', function () {
            testLens.over(testArr, function (attr) { return attr * 10; })[0].should.equal(10);
        });
    });
});