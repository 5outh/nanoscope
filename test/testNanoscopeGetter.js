"use strict";

var nanoscope = require('../index');

describe('nanoscope.getter', function () {
    it('should not allow setting in a base level lens', function () {
        expect(function () {
            nanoscope([1, 2, 3]).index(0).getter().set(10);
        }).to.throw(Error, 'map not permitted in a Getter');
    });

    it('should not allow setting in a composite lens', function () {
        expect(function () {
            nanoscope([{a: 1}, 2, 3]).index(0).path('a').getter().set(10);
        }).to.throw(Error, 'map not permitted in a Getter');
    });

    it('should allow getting in a base level lens', function () {
        expect(nanoscope([1, 2, 3]).index(0).getter().get()).to.equal(1);
    });

    it('should allow getting in a composite lens', function () {
        expect(nanoscope([{a: 1}, 2, 3]).index(0).path('a').getter().get()).to.equal(1);
    });
});