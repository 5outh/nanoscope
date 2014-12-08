"use strict";

var _ = require('lodash'),
    IndexedLens = require('../src/dynamic/IndexedLens'),
    Setter = require('../src/Setter');

describe('Setter', function () {
    var testArr, testLens;

    beforeEach(function () {
        testArr = [1, 2, 3];
        testLens = new IndexedLens(0);
    });

    describe('#fromLens', function () {
        it('should be marked as a setter', function () {
            Setter.fromLens(testLens).should.have.property('_setter', true);
        });

        it('should have the same over function as before', function () {
            Setter.fromLens(testLens)._over.should.equal(testLens._over);
        });

        it('should have the same set function as before', function () {
            Setter.fromLens(testLens).set.should.equal(testLens.set);
        });
    });

    describe('#Setter', function () {
        var setter = new Setter(
                function (arr, func) {
                    var newArr = _.cloneDeep(arr);
                    newArr[0] = func(newArr[0]);
                    return newArr;
                }
            ),
            testArr = [1, 2, 3];

        it('should multiply the first element by 10', function () {
            setter.over(testArr, function (attr) { return attr * 10; })[0].should.equal(10);
        });

        it('should set the first element to 100', function () {
           setter.set(testArr, 100)[0].should.equal(100);
        });

        it('should throw an error', function () {
            try {
                setter.get(testArr);
            } catch (ex) {
                ex.message.should.equal('get not permitted in a Setter');
            }
        });
    });
});