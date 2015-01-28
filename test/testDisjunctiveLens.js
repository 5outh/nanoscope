"use strict";

var _ = require('lodash'),
    nanoscope = require('../index'),

    IndexedLens = nanoscope.IndexedLens,
    PathLens = nanoscope.PathLens,
    DisjunctiveLens = nanoscope.DisjunctiveLens,
    Compose = nanoscope.Compose;

describe('DisjunctiveLens', function () {
    var lens = nanoscope({ foo: 1 }),
        disjunctiveLens = new DisjunctiveLens(
            new PathLens('foo').index(0),
            new PathLens('foo')
        );

    describe('#get', function () {
        it('should return 1', function () {
            disjunctiveLens.get({foo: 1}).should.equal(1);
        });

        it('should return null', function () {
            var disjunctiveLens = new DisjunctiveLens(
                new PathLens('foo').index(0),
                new PathLens('bar')
            );

            expect(disjunctiveLens.get({ foo: [] })).to.equal(null);
        });
    });

    describe('#set', function () {
        it('should set foo to 10', function () {
            expect(disjunctiveLens.set({foo: 1}, 11)).to.eql({ foo: 11 });
        });
    });

    describe('#map', function () {
        it('should add 10 to foo', function () {
            expect(disjunctiveLens.map({foo: 1}, function (el) { return el + 10; })).to.eql({ foo: 11 });
        });

        it('should return the original object', function () {
            var disjunctiveLens = new DisjunctiveLens(
                new PathLens('foo').index(0),
                new PathLens('bar.baz')
            );

            expect(disjunctiveLens.map({ foo: [] }, function (el) { return el + 10; })).to.eql({ foo: []});
        });
    });
});