"use strict";

var nanoscope = require('../index');

describe('nanoscope.setter', function () {
    it('should not allow getting in a base level lens', function () {
        expect(function () {
            nanoscope([1, 2, 3]).index(0).setter().get();
        }).to.throw(Error, 'get not permitted in a Setter');
    });

    it('should not allow getting in a composite lens', function () {
        expect(function () {
            nanoscope([{a: 1}, 2, 3]).index(0).path('a').setter().get();
        }).to.throw(Error, 'get not permitted in a Setter');
    });

    it('should allow setting in a base level lens', function () {
        expect(nanoscope([1, 2, 3]).index(0).setter().set(10)).to.eql([10, 2, 3]);
    });

    it('should allow setting in a composite lens', function () {
        expect(nanoscope([{a: 10}, 2, 3]).index(0).path('a').setter().set(10)).to.eql([{a: 10}, 2, 3]);
    });
});