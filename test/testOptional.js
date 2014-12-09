var Lens = require('../src/Lens'),
    Optional = require('../src/combinator/Optional'),
    Getter = require('../src/Getter'),
    Setter = require('../src/Setter'),
    IndexedLens = require('../src/array/IndexedLens'),
    IdLens = require('../src/IdLens'),
    utils = require('./utils');

describe('Optional', function () {
    describe('#Optional', function () {
        it('should create an optional lens with correct properties', function () {
            new Optional(new IdLens()).should.have.property('_optional', true);
        });
    });

    describe('Getter', function () {
        it('should still fail when trying to set a value in a Getter', function () {
            try {
                new Optional(
                    Getter.fromLens(new IdLens())
                ).set(10, 20);
            } catch (ex) {
                ex.message.should.equal('over not permitted in a Getter');
            }
        });
    });

    describe('Setter', function () {
        it('should still fail when trying to get a value in a setter', function () {
            try {
                new Optional(
                    Setter.fromLens(new IdLens())
                ).get(10);
            } catch (ex) {
                ex.message.should.equal('get not permitted in a Setter');
            }
        });
    });

    describe('IndexedLens', function () {
        var testArr, testLens;

        beforeEach(function () {
            testArr = [1, 2, 3];
            testLens = new Optional(new IndexedLens(5));
        });

        it('should not get a value but should not throw an error either', function () {
            (testLens.get(testArr) === null).should.be.true;
        });

        it('should not set a value but should not throw an error either', function () {
            utils.testArrayEquals(testLens.set(testArr, 100), [1, 2, 3]);
        });
    });
});