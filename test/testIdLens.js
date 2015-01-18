"use strict";

var nanoscope = require('../index'),
    IdLens = nanoscope.IdLens;

describe('IdLens', function () {
    var lens;

    beforeEach(function () {
        lens = new IdLens();
    });

    describe('#get', function () {
        it('should return the internal element', function () {
            lens.get(10).should.equal(10);
        });
    });

    describe('#set', function () {
        it('should set the internal element', function () {
            lens.set(10, 20).should.equal(20);
        });
    });

    describe('#map', function () {
        it('should square the internal element', function () {
            lens.map(10, function (val) { return Math.pow(val, 2) }).should.equal(100);
        });
    });
});