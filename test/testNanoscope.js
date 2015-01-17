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
            var lens = nanoscope([1, 2, 3]).unsafeIndex(100);

            expect(function () {
                lens.get();
            }).to.throw(Error, 'Attempt to access invalid index 100');
        });
    });
});