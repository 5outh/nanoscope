"use strict";

var nanoscope = require('../index');

describe('defaults', function () {
    it('should return null for an indexed lens', function () {
        expect(nanoscope(null).index(100).get()).to.equal(null);
    });

    it('should return [] for a filter lens', function () {
        expect(nanoscope(null).filter(/\*/).get()).to.eql([]);
    });

    it('should return [] for a slice lens', function () {
        expect(nanoscope(null).slice('0:10').get()).to.eql([]);
    });

    it('should return {} for a pluck lens', function () {
        expect(nanoscope(null).pluck(['a']).get()).to.eql({});
    });

    it('should return null for a path lens', function () {
        expect(nanoscope(null).path('a').get()).to.eql(null);
    });
});