"use strict";

var _ = require('lodash'),
    PathLens = require('../src/object/PathLens'),
    utils = require('./utils');

describe('PathLens', function () {
    var testJS, testLens;

    beforeEach(function () {
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

        it('should not modify a deeply nested value if it doesnt exist', function () {
            var lens = new PathLens('a.b.c.d.e.f');

            lens.over(testJS, function (attr) { return attr; }).a.b.should.not.have.property('c');
        });
    });

    describe('#PathLens.Unsafe', function () {
        describe('#get', function () {
            var lens = new PathLens.Unsafe('a.b');

            it('should not fail when trying to get an attribute that exists', function () {
                lens.get({a: { b: 10}}).should.equal(10);
            });

            it('should fail when trying to get an attribute that does not exist', function () {
                try {
                    console.log(lens.get({}));
                } catch (ex) {
                    ex.message.should.equal('Cannot read property \'b\' of undefined');
                }
            });
        });

        describe('#set', function () {
            var lens = new PathLens.Unsafe('a.b');

            it('should not fail when trying to set an attribute that exists', function () {
                lens.set({a: { b: 10}}, 20).a.b.should.equal(20);
            });

            it('should fail when trying to set an attribute that does not exist', function () {
                try {
                    console.log(lens.set({}, 10));
                } catch (ex) {
                    ex.message.should.equal('Cannot read property \'b\' of undefined');
                }
            });
        });
    });

    describe('#deriveLenses', function () {
        var obj = { a: { b: { c: { d: { e: 'hello' }, f: 10 }}}};

        it('should return lenses for each path in object', function () {
            var lenses = PathLens.deriveLenses(obj),
                paths = _.keys(lenses);

            utils.testArrayEquals(
                paths,
                [ 'a', 'a.b', 'a.b.c', 'a.b.c.d', 'a.b.c.d.e', 'a.b.c.f' ]
            );

            lenses['a.b.c.d.e'].get(obj).should.equal('hello');
        });
    });
});