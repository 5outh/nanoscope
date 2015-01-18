"use strict";

var _ = require('lodash'),
    nanoscope = require('../index'),
    IndexedLens = nanoscope.IndexedLens,
    PathLens = nanoscope.PathLens,
    utils = require('./utils');

describe('IndexedLens', function () {
    var testArr, testLens;

    beforeEach(function () {
        testArr = [1, 2, 3];
        testLens = new IndexedLens(0);
    });

    describe('#Unsafe', function () {
        var unsafeLens = new IndexedLens.Unsafe(0);

        describe ('#get', function () {
            it('should get the first element of the array', function () {
                unsafeLens.get(testArr).should.equal(1);
            });

            it('should fail when trying to get an element out of range', function () {
                try {
                    unsafeLens.get([]);
                } catch (ex) {
                    ex.message.should.equal('Attempt to access invalid index 0');
                }
            });
        });

        describe('#set', function () {
            it('should set the first element of the array', function () {
                unsafeLens.set(testArr, 10)[0].should.equal(10);
            });

            it('should fail when trying to set an element out of range', function () {
                try {
                    new IndexedLens.Unsafe(1).set([], 1);
                } catch (ex) {
                    ex.message.should.equal('Array index 1 out of range');
                }
            });
        });

        describe('#map', function () {
            it('should map over the first element in the array', function () {
                unsafeLens.map(testArr, function (val) { return val + 10 })[0].should.equal(11);
            });

            it('should fail when trying to map over an element out of range', function () {
                try {
                    new IndexedLens.Unsafe(1).map([], _.identity);
                } catch (ex) {
                    ex.message.should.equal('Array index 1 out of range');
                }
            });
        });

    });

    describe('#get', function () {
        it('should return 1', function () {
            testLens.get(testArr).should.equal(1);
        });

        it('should return the last element of the array when using a negative index', function () {
            var lens = new IndexedLens(-1);

            lens.get(testArr).should.equal(3);
        });

        it('should return null when element is out of range', function () {
            var lens = new IndexedLens(10);

            (lens.get(testArr) === null).should.be.true;

            lens = new IndexedLens(-10);

            (lens.get(testArr) === null).should.be.true;
        });
    });

    describe('#set', function () {
        it('should return a new object with modified first element', function () {
            testLens.set(testArr, 9)[0].should.equal(9);
        });

        it('should add an element at the end of the array', function () {
            var lens = new IndexedLens(3);

            lens.set(testArr, 3)[3].should.equal(3);
        });

        it('should set the last element of the list when using a negative index', function () {
            var lens = new IndexedLens(-1);

            lens.set(testArr, 100)[2].should.equal(100);
        });

        it('should fail if trying to set a negative element that is too large', function () {
            var lens = new IndexedLens(-100);

            try {
                lens.set(testArr, 100);
            } catch (ex) {
                ex.message.should.equal('Array index -97 out of range.');
            }
        });

        it('should fail if trying to set an element that is too large', function () {
            var lens = new IndexedLens(5);

            try {
                lens.set(testArr, 3);
            } catch (ex) {
                ex.message.should.equal('Array index 5 out of range.');
            }
        });
    });

    describe('#map', function () {
        it('should multiply testArr[0] by 10', function () {
            testLens.map(testArr, function (attr) { return attr * 10; })[0].should.equal(10);
        });
    });

    describe('#deriveLenses', function () {
        it('should give back lenses for every index', function () {
            var lenses = IndexedLens.deriveLenses(testArr);

            _.forEach(lenses, function (lens, index) {
                lens.getFlags()._index.should.equal(index);
                lens.get(testArr).should.equal(testArr[index]);
            });
        });
    });

    describe('#composeIndex', function () {
        it('should properly compose', function () {
            var arr = [[0]],
                lens = new IndexedLens(0).composeIndex(0);

            lens.view(arr).get().should.equal(0);
        });

        it('should work properly with a PathLens', function () {
            var obj = {a: [0]},
                lens = new PathLens('a').composeIndex(0);

            lens.view(obj).get().should.equal(0);

            expect(lens.view(obj).set(100)).to.eql({
                a:  [100]
            });
        });
    });

    describe('#addIndex', function () {
        it('should properly add an index', function () {
            var arr = [1, 2],
                lens = new IndexedLens(0).addIndex(1);

            utils.testArrayEquals(
                lens.view(arr).get(),
                [1, 2]
            );
        });
    });
});