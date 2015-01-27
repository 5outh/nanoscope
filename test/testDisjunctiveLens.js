"use strict";

var _ = require('lodash'),
    nanoscope = require('../index'),
    IndexedLens = nanoscope.IndexedLens,
    DisjunctiveLens = nanoscope.DisjunctiveLens,
    Compose = nanoscope.Compose;

describe('DisjunctiveLens', function () {
    var lens = nanoscope({ foo: 1 }),
        disjunctiveLens = new DisjunctiveLens(lens.path('foo').index(0), lens.path('foo'));

    describe('#get', function () {
        it('should return 1', function () {
            disjunctiveLens.get().should.equal(1);
        });
    });

    describe('#set', function () {
        it('should set foo to 10', function () {
            expect(disjunctiveLens.set(11)).to.eql({ foo: 11 });
        });
    });

    describe('#map', function () {
        it('should add 10 to foo', function () {
            expect(disjunctiveLens.map(function (el) { return el + 10; })).to.eql({ foo: 11 });
        });
    });
});