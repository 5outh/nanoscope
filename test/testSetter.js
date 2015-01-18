"use strict";

var _ = require('lodash'),
    nanoscope = require('../index'),
    IndexedLens = nanoscope.IndexedLens,
    Setter = nanoscope.Setter,
    Getter = nanoscope.Getter,
    IdLens = nanoscope.IdLens;

describe('Setter', function () {
    var testArr, testLens;

    beforeEach(function () {
        testArr = [1, 2, 3];
        testLens = new IndexedLens(0);
    });

    describe('#fromLens', function () {
        it('should be marked as a setter', function () {
            Setter.fromLens(testLens).getFlags().should.have.property('_setter', true);
        });

        it('should be marked as indexed', function () {
            Setter.fromLens(testLens).getFlags().should.have.property('_index', 0);
        });

        it('should have the same over function as before', function () {
            Setter.fromLens(testLens).map.should.equal(testLens.map);
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
            setter.map(testArr, function (attr) { return attr * 10; })[0].should.equal(10);
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

    describe('Set/Get Combo', function () {
        var setGetLens = Setter.fromLens(Getter.fromLens(new IdLens()));

        it('should fail to get', function () {
            try {
                setGetLens.get(100);
            } catch (ex) {
                ex.message.should.equal('get not permitted in a Setter');
            }
        });

        it('should fail to set', function () {
            try {
                setGetLens.set(100, 200);
            } catch (ex) {
                ex.message.should.equal('map not permitted in a Getter');
            }
        });
    });
});