"use strict";

var nanoscope = require('../src/nanoscope');

describe('nanoscope', function () {

    describe('#get', function () {
        it('should do the same thing as an IndexedLens', function () {
            var lens = nanoscope([1, 2, 3]);

            lens.index(0).get().should.equal(1);
            lens.index(100).get();
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

            console.log(lens.path('a').index(0).pluck(/[a-z]/));
        });
    });
});