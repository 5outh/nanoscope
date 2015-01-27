"use strict";

var _ = require('lodash'),
    nanoscope = require('../index'),
    IndexedLens = nanoscope.IndexedLens,
    DisjunctiveLens = nanoscope.DisjunctiveLens,
    Compose = nanoscope.Compose;

describe('Compose', function () {
    var foo = { foo: 1},
        disjunctiveLens = new DisjunctiveLens(nanoscope(foo).path('foo').index(0), nanoscope(foo).path('foo'));

    describe('#get', function () {
        it('should return 1', function () {
            disjunctiveLens.get().should.equal(1);
        });
    });

    describe('#map', function () {
        it('should add 10 to foo', function () {
            expect(disjunctiveLens.map(function (el) { return el + 10; })).to.eql({ foo: 11 });
        });
    });
});