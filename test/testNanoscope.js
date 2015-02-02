"use strict";

var nanoscope = require('../index');

describe('nanoscope', function () {

    describe('#get', function () {
        it('should do the same thing as an IndexedLens', function () {
            var lens = nanoscope([1, 2, 3]);

            lens.index(0).get().should.equal(1);
            lens.indexing(0).get().should.equal(1);

        });

        it('should do the same thing as an unsafe IndexedLens', function () {
            var lens = nanoscope([1, 2, 3]);

            expect(function () {
                lens.unsafeIndex(100).get();
            }).to.throw(Error, 'Attempt to access invalid index 100');

            expect(function () {
                lens.unsafelyIndexing(100).get();
            }).to.throw(Error, 'Attempt to access invalid index 100');
        });

        it('should do the same thing as a SliceLens', function () {
            var lens = nanoscope([1, 2, 3]);

            expect(lens.slice(0, 2).get()).to.eql([1, 2]);
            expect(lens.slicing(0, 2).get()).to.eql([1, 2]);
        });

        it('should first slice, then index', function () {
            var lens = nanoscope([1, 2, 3]);

            expect(lens.slice(1, 2).index(0).get()).to.eql(2);
            expect(lens.slicing(1, 2).indexing(0).get()).to.eql(2);
        });

        it('should do the same thing as a PathLens', function () {
            var lens = nanoscope({ a: { b: 100 } });

            expect(lens.path('a.b').get()).to.equal(100);
            expect(lens.following('a.b').get()).to.equal(100);
        });

        it('should do the same thing as an unsafe PathLens', function () {
            var lens = nanoscope({ a: { b: 100 } });

            expect(function () {
                lens.unsafePath('a.b.c.d').get();
            }).to.throw(TypeError, 'Cannot read property \'d\' of undefined');

            expect(function () {
                lens.unsafelyFollowing('a.b.c.d').get();
            }).to.throw(TypeError, 'Cannot read property \'d\' of undefined');

            // Test that `catch` works as expected
            lens.unsafePath('a.b.c.d').catch(function (err) {
                return err.message;
            }).get().should.equal('Cannot read property \'d\' of undefined');

        });

        it('should do the same thing as a PluckLens', function () {
            var lens = nanoscope({ a: 100, A: 99 });

            expect(lens.pluck(['a']).get()).to.eql({
                a: 100
            });

            expect(lens.plucking(['a']).get()).to.eql({
                a: 100
            });
        });

        it('should do the same thing as a recursive PluckLens', function () {
            var lens = nanoscope({ a: { b: 100, B: 99 }, A: 99});

            expect(lens.recursivePluck(/[a-z]/).get()).to.eql({
                a: {
                    b: 100
                }
            });

            expect(lens.recursivelyPlucking(/[a-z]/).get()).to.eql({
                a: {
                    b: 100
                }
            });
        });

        it('should do the same thing as a DisjunctiveLens', function () {
            var lens = nanoscope({ foo: 1}),
                disjunctiveLens = lens.path('foo').index(0).or(lens.path('foo')),
                _disjunctiveLens = disjunctiveLens = lens.following('foo').indexing(0).or(lens.path('foo'));

            disjunctiveLens.get().should.equal(1);
            _disjunctiveLens.get().should.equal(1);
        });

        it('should do the same thing as a ConjunctiveLens', function () {
            var foobar = {foo: 1, bar: 2},
                lens = nanoscope(foobar),
                conjunctiveLens = lens.path('foo').and(lens.path('bar')),
                _conjunctiveLens = lens.following('foo').and(lens.following('bar'));

            expect(conjunctiveLens.get()).to.eql([1, 2]);
            expect(_conjunctiveLens.get()).to.eql([1, 2]);
        });

        it('should be able to iterate over an array', function () {
            var thing = [{x: 100, y: 200}, {x: 10, y:0}];

            expect(
                nanoscope(thing).each(
                    function (loc) {
                        return loc.path('x');
                    }).get()
            ).to.eql([100, 10]);
        });

        it('should be able to compose lots of stuff', function () {
            var lens = nanoscope({
                    a: [{b : 100, c: 0, B: 99}, 2, 3]
                }),
                getValue = lens.path('a').index(0).pluck(/[a-z]/).get(),
                _getValue = lens.following('a').indexing(0).plucking(/[a-z]/).get();

            expect(getValue).to.eql({
                b: 100,
                c: 0
            });

            expect(_getValue).to.eql({
                b: 100,
                c: 0
            });
        });

        it('shouldnt fail', function () {
            var lens = nanoscope(null);

            expect(lens.index(0).path('a.b.c').filter(['a']).pluck(['b']).index(1000).get()).to.be.null;
        });
    });

    describe('#set', function () {
        it('should do the same thing as an IndexedLens', function () {
            var lens = nanoscope([1, 2, 3]);

            expect(lens.index(0).set(100)).to.eql([100, 2, 3]);
        });

        it('should do the same thing as an unsafe IndexedLens', function () {
            var lens = nanoscope([1, 2, 3]);

            expect(function () {
                lens.unsafeIndex(100).set(99);
            }).to.throw(Error, 'Array index 100 out of range');
        });

        it('should do the same thing as a SliceLens', function () {
            var lens = nanoscope([1, 2, 3]);

            expect(lens.slice(0, 2).set([])).to.eql([3]);
        });

        it('should first slice, then index', function () {
            var lens = nanoscope([1, 2, 3]);

            expect(lens.slice(1, 2).index(0).set(100)).to.eql([1, 100, 3]);
        });

        it('should do the same thing as a PathLens', function () {
            var lens = nanoscope({ a: { b: 100 } });

            expect(lens.path('a.b').set(0)).to.eql({
                a: {
                    b: 0
                }
            });
        });

        it('should do the same thing as an unsafe PathLens', function () {
            var lens = nanoscope({ a: { b: 100 } });

            expect(function () {
                lens.unsafePath('a.b.c.d').set(100);
            }).to.throw(TypeError, 'Cannot read property \'d\' of undefined');
        });

        it('should do the same thing as a PluckLens', function () {
            var lens = nanoscope({ a: 100, b: 100, A: 99 });

            expect(lens.pluck(['a', 'b']).set(0)).to.eql({
                a: 0,
                b: 0,
                A: 99
            });
        });

        it('should do the same thing as a recursive PluckLens', function () {
            var lens = nanoscope({ A: { b: 100, B: 99 } });

            expect(lens.recursivePluck(/[a-z]/).set(0)).to.eql({
                A: {
                    b: 0,
                    B: 99
                }
            });
        });

        it('should do the same thing as a DisjunctiveLens', function () {
            var lens = nanoscope({ foo: 1}),
                disjunctiveLens = lens.path('foo').index(0).or(lens.path('foo'));

            expect(disjunctiveLens.set(100)).to.eql({ foo: 100 });
        });

        it('should do the same thing as a ConjunctiveLens', function () {
            var foobar = {foo: 1, bar: 2},
                lens = nanoscope(foobar),
                disjunctiveLens = lens.path('foo').and(lens.path('bar'));

            expect(disjunctiveLens.set(100)).to.eql({foo: 100, bar: 100});
        });

        it('should be able to compose lots of stuff', function () {
            var lens = nanoscope({
                    a: [{b : 0, c: 0, B: 99}, 2, 3]
                }),
                getValue = lens.path('a').index(0).pluck(/[a-z]/).set(100);

            expect(getValue).to.eql({
                a: [{b : 100, c: 100, B: 99}, 2, 3]
            });
        });

        it('should return the original object', function () {
            var lens = nanoscope({ a: 10 });

            expect(lens.index(0).path('a.b.c').filter(['a']).pluck(['b']).index(1000).set(100)).to.eql({a: 10});
        });
    });

    describe('#mixin', function () {
        var within = function (target, alpha) {
            return this.filtering(function (elem) {
                return (target - alpha) < elem  && elem < (target + alpha);
            });
        };

        it('should add the within function to nanoscope and Lens base', function () {
            nanoscope.mixin({within: within});

            expect(nanoscope.prototype.within).to.be.a('function');
            expect(nanoscope.Lens.prototype.within).to.be.a('function');

            // Test that it works
            expect(nanoscope([10, 2.5, 3]).within(3.5, 1.5).get()).to.eql([2.5, 3]);
            expect(nanoscope({ index: [10, 2.5, 3] }).path('index').within(3.5, 1.5).get()).to.eql([2.5, 3]);
        });

        it('should not add non-functions to prototypes', function () {
            nanoscope.mixin({silly: 'silly'});

            expect(nanoscope.prototype).not.to.have.property('silly');
            expect(nanoscope.Lens.prototype).not.to.have.property('silly');

        });
    });
});