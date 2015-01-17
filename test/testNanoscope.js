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
    });
});