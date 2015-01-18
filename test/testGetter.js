"use strict";

var _ = require('lodash'),
    nanoscope = require('../index'),
    IndexedLens = nanoscope.IndexedLens,
    Getter = nanoscope.Getter,
    Setter = nanoscope.Setter,
    IdLens = nanoscope.IdLens;

describe('Getter', function () {
    var testArr, testLens;

    beforeEach(function () {
        testArr = [1, 2, 3];
        testLens = new IndexedLens(0);
    });

    describe('#fromLens', function () {
        it('should be marked as a getter', function () {
            Getter.fromLens(testLens).getFlags().should.have.property('_getter', true);
        });

        it('should be marked as indexed', function () {
            Getter.fromLens(testLens).getFlags().should.have.property('_index', 0);
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
                getter.map(testArr, function () {});
            } catch (ex) {
                ex.message.should.equal('map not permitted in a Getter');
            }
        });
    });

    describe('Get/Set Combo', function () {
        var getSetLens = Getter.fromLens(Setter.fromLens(new IdLens()));

        it('should fail to get', function () {
            try {
                getSetLens.get(100);
            } catch (ex) {
                ex.message.should.equal('get not permitted in a Setter');
            }
        });

        it('should fail to set', function () {
            try {
                getSetLens.set(100, 200);
            } catch (ex) {
                ex.message.should.equal('map not permitted in a Getter');
            }
        });
    });
});