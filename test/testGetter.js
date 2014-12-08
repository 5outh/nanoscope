"use strict";

var _ = require('lodash'),
    IndexedLens = require('../src/dynamic/IndexedLens'),
    Getter = require('../src/Getter');

describe('Getter', function () {
    var testArr, testLens;

    beforeEach(function () {
        testArr = [1, 2, 3];
        testLens = new IndexedLens(0);
    });

    describe('#fromLens', function () {
        it('should be marked as a getter', function () {
            Getter.fromLens(testLens).should.have.property('_getter', true);
        });

        it('should have the same get function as before', function () {
            Getter.fromLens(testLens)._get.should.equal(testLens._get);
        });
    });

    describe('#Getter', function () {
        var getter = new Getter(function (arr) { return arr[0]; }),
            testArr = [1, 2, 3];

        it('should return 1', function () {
            getter.get(testArr).should.equal(1);
        });

        it('should throw an error', function () {
            try {
                getter.over(testArr, function () {});
            } catch (ex) {
                ex.message.should.equal('over not permitted in a Getter');
            }
        });
    });
});