var _ = require('lodash'),
    nanoscope = require('../index'),
    Lens = nanoscope.Lens,
    IndexedLens = nanoscope.IndexedLens,
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

    describe('#map', function () {
        it('should turn testJS.a.b into cat', function () {
            testLens.map(testJS, function (attr) { return attr + 'at'; }).a.b.should.equal('cat');
            testLens.view(testJS).map(function (attr) { return attr + 'at'; }).a.b.should.equal('cat');
        });
    });

    describe('#then', function () {
        it('should allow using then to compose', function () {
            var testObj = { a: { b: [100] } };

            testLens.viewing(testObj).then.indexing(0).get().should.equal(100);
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
            testLens.map(testJS, function (attr) { return attr + 'at'; }).a.b.should.equal('cat');
        });
    });

    describe('#compose', function () {
        it('should compose the lens with another lens', function () {
            var headLens = new IndexedLens(0),
                composed = testLens.compose(headLens),
                obj = {a : { b: [1, 2, 3] }};

            composed.view(obj).get().should.equal(1);

            utils.testArrayEquals(
                composed.view(obj).set(100).a.b,
                [100, 2, 3]
            );
        });
    });

    describe('#composeMany', function () {
        it('should compose several lenses when given an array argument', function () {
            var headLens = new IndexedLens(0),
                composed = headLens.composeMany([headLens, headLens]),
                arr = [[[1]]];

            composed.view(arr).get().should.equal(1);
        });

        it('should compose several lenses when given variable-length argument', function () {
            var headLens = new IndexedLens(0),
                composed = headLens.composeMany(headLens, headLens),
                arr = [[[1]]];

            composed.view(arr).get().should.equal(1);
        });
    });

    describe('#add', function () {
        it('should add the lens to another lens', function () {
            var multi = new IndexedLens(0).add(new IndexedLens(1)),
                arr = [1, 2, 3];

            utils.testArrayEquals(multi.view(arr).get(), [1, 2]);

            utils.testArrayEquals(
                multi.view(arr).set(100),
                [100, 100, 3]
            );
        });
    });

    describe('#addMany', function () {
        it('should add several lenses when given an array argument', function () {
            var composed = new IndexedLens(0).addMany([new IndexedLens(1), new IndexedLens(2)]),
                arr = [1, 2, 3];

            utils.testArrayEquals(composed.view(arr).get(), [1, 2, 3]);
        });

        it('should add several lenses when given variable-length argument', function () {
            var composed = new IndexedLens(0).addMany(new IndexedLens(1), new IndexedLens(2)),
                arr = [1, 2, 3];

            utils.testArrayEquals(composed.view(arr).get(), [1, 2, 3]);
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

    describe('#each', function () {
        var thing, lens;

        beforeEach(function () {
            thing = {
                locations: [{x: 100, y: 200}, {x: 10, y:0}]
            };

            lens = nanoscope(thing).path('locations').each(function (loc) {
                return loc.path('x');
            })
        });

        it('should get properly', function () {

            expect(lens.get()).to.eql([100, 10]);
        });

        it('should set properly', function () {
            expect(lens.set(99)).to.eql({
                locations: [
                    {x: 99, y: 200},
                    {x: 99, y:0}
                ]
            });
        });

        it('should map properly', function () {
            expect(lens.map(function (x) {
                return x * 2;
            })).to.eql({
                locations: [
                    {x: 200, y: 200},
                    {x: 20, y:0}
                ]
            });
        });
    });

    describe('#own', function () {
        var thing, lens;

        beforeEach(function () {
            thing = { x: [100], y: [200] };

            lens = nanoscope(thing).own(function (val) { return val.index(0); });
        });

        it('should get properly', function () {
            expect(lens.get()).to.eql([100, 200]);
        });

        it('should set properly', function () {
            expect(lens.set(99)).to.eql({ x: [99], y: [99] });
        });

        it('should map properly', function () {
            expect(lens.map(function (x) {
                return x * 2;
            })).to.eql({ x: [200], y: [400] });
        });
    });
});