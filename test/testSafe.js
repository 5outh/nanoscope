"use strict";

var _ = require('lodash'),
    PathLens = require('../src/dynamic/safe');

describe('Lens', function () {
    var testJS, testLens;

    beforeEach (function () {
        testJS = {
            a: {
                b: 'c'
            }
        };

        testLens = new PathLens('a.b');

    });
    describe('#get', function () {
        it('should return c', function () {
            testLens.get(testJS).should.equal('c');
        });
    });

    describe('#set', function () {
        it('should return a new object with modified obj.a.b', function () {
            testLens.set(testJS, 9).a.b.should.equal(9);
        });

        it('should add a property even if it isnt there', function () {
            var lens = new PathLens('a.b.c.d.e.f');

            lens.set(testJS, 'hello').a.b.c.d.e.f.should.equal('hello');
        });
    });

    describe('#over', function () {
        it('should turn testJS.a.b into cat', function () {
            testLens.over(testJS, function (attr) { return attr + 'at'; }).a.b.should.equal('cat');
        });
    });
});