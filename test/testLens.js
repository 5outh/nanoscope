var _ = require('lodash'),
    Lens = require('../src/Lens'),
    IndexedLens = require('../src/array/IndexedLens'),
    utils = require('./utils');

describe('Lens', function () {
    var testJS, testLens;

    beforeEach(function () {
        testJS = {
            a: {
                b: 'c'
            }
        };
        testLens = new Lens(
            function (obj) {
                return obj.a.b;
            },
            function (obj, func) {
                var newObj = _.cloneDeep(obj);
                newObj.a.b = func(newObj.a.b);
                return newObj;
            },
            { _extra: 'extra' }
        );
    });

    describe('#get', function () {
        it('should return c', function () {
            testLens.get(testJS).should.equal('c');
            testLens.view(testJS).get().should.equal('c');
        });
    });

    describe('#set', function () {
        it('should return a new object with modified obj.a.b', function () {
            testLens.set(testJS, 9).a.b.should.equal(9);
            testLens.view(testJS).set(9).a.b.should.equal(9);
        });
    });

    describe('#over', function () {
        it('should turn testJS.a.b into cat', function () {
            testLens.over(testJS, function (attr) { return attr + 'at'; }).a.b.should.equal('cat');
            testLens.view(testJS).over(function (attr) { return attr + 'at'; }).a.b.should.equal('cat');
        });
    });

    describe('#view', function () {
        it('should set the view to 10', function () {
            testLens.view(10)._view.should.equal(10);
        });

        it('should still run functions on the correct object', function () {
            testLens.view(10);

            testLens.get(testJS).should.equal('c');
            testLens.set(testJS, 9).a.b.should.equal(9);
            testLens.over(testJS, function (attr) { return attr + 'at'; }).a.b.should.equal('cat');
        });
    });

    describe('#compose', function () {
        it('should compose the lens with another lens', function () {
            var headLens = new IndexedLens(0),
                composed = testLens.compose(headLens),
                obj = {a : { b: [1, 2, 3] }};

            composed.view(obj).get().should.equal(1);

            console.log(composed.view(obj).set(100));

            utils.testArrayEquals(
                composed.view(obj).set(100).a.b,
                [100, 2, 3]
            );
        });
    });

    describe('#blur', function () {
        beforeEach(function () {
            testLens.view(10);
        });

        it('should reset the view to null', function () {
            (testLens.blur()._view === null).should.be.true;
        });
    });

    describe('#getFlags', function () {
        it('should return all custom options', function () {
            JSON.stringify(testLens.getFlags())
                .should.equal(JSON.stringify({ _extra: 'extra' }));
        });
    });
});