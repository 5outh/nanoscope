"use strict";

var IdLens = require('../src/IdLens');

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

    describe('#over', function () {
        it('should square the internal element', function () {
            lens.over(10, function (val) { return Math.pow(val, 2) }).should.equal(100);
        });
    });
});