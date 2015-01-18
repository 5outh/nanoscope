"use strict";

var nanoscope = require('../src/nanoscope');

describe('nanoscope', function () {

    describe('#get', function () {
        it('should do the same thing as an IndexedLens', function () {
            var lens = nanoscope([1, 2, 3]);

            lens.index(0).get().should.equal(1);
        });

        it('should do the same thing as an unsafe IndexedLens', function () {
            var lens = nanoscope([1, 2, 3]);

            expect(function () {
                lens.unsafeIndex(100).get();
            }).to.throw(Error, 'Attempt to access invalid index 100');
        });

        it('should do the same thing as a SliceLens', function () {
            var lens = nanoscope([1, 2, 3]);

            expect(lens.slice(0, 2).get()).to.eql([1, 2]);
        });

        it('should first slice, then index', function () {
            var lens = nanoscope([1, 2, 3]);

            expect(lens.slice(1, 2).index(0).get()).to.eql(2);
        });

        it('should do the same thing as a PathLens', function () {
            var lens = nanoscope({ a: { b: 100 } });

            expect(lens.path('a.b').get()).to.equal(100);
        });

        it('should do the same thing as an unsafe PathLens', function () {
            var lens = nanoscope({ a: { b: 100 } });

            expect(function () {
                lens.unsafePath('a.b.c.d').get();
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
        });

        it('should do the same thing as a recursive PluckLens', function () {
            var lens = nanoscope({ a: { b: 100, B: 99 }, A: 99});

            expect(lens.recursivePluck(/[a-z]/).get()).to.eql({
                a: {
                    b: 100
                }
            });
        });

        it('should be able to compose lots of stuff', function () {
            var lens = nanoscope({
                    a: [{b : 100, c: 0, B: 99}, 2, 3]
                }),
                getValue = lens.path('a').index(0).pluck(/[a-z]/).get();

            expect(getValue).to.eql({
                b: 100,
                c: 0
            });
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

        it('should be able to compose lots of stuff', function () {
            var lens = nanoscope({
                    a: [{b : 0, c: 0, B: 99}, 2, 3]
                }),
                getValue = lens.path('a').index(0).pluck(/[a-z]/).set(100);

            expect(getValue).to.eql({
                a: [{b : 100, c: 100, B: 99}, 2, 3]
            });
        });
    });
});