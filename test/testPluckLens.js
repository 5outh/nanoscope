"use strict";

var _ = require('lodash'),
    PluckLens = require('../src/object/PluckLens'),
    utils = require('./utils');

describe('PluckLens', function () {

    describe('#PluckLens', function () {
        it('should create a new pluck lens from an array', function () {
            var pluckLens = new PluckLens(['a', 'b']);

            pluckLens.should.have.properties({
                _flags: {
                    _pluck: ['a', 'b'],
                    _recursive: false
                }
            });
        });

        it('should set the recursive flag', function () {
            var regex = /[a-z]/,
                pluckLens = new PluckLens.Recursive(regex);

            pluckLens.should.have.properties({
                _flags: {
                    _pluck: regex,
                    _recursive: true
                }
            });
        });

        it('should create a new pluck lens from a regular expression', function () {
            var regex = /[a-z]/,
                pluckLens = new PluckLens(regex);

            pluckLens.should.have.properties({
                _flags: {
                    _pluck: regex,
                    _recursive: false
                }
            });
        });

        it('should create a new pluck lens from a function', function () {
            var fn = _.identity,
                pluckLens = new PluckLens(fn);

            pluckLens.should.have.properties({
                _flags: {
                    _pluck: fn,
                    _recursive: false
                }
            });
        });
    });

    describe('#get', function () {
        var obj = {
            a: { b: 0, C: 2},
            d: 1,
            E: []
        };

        it('should get an object containing the correct properties with a pluck array', function () {
            var pluckLens = new PluckLens(['d', 'E']);

            expect(pluckLens.view(obj).get()).to.eql({
                d: 1,
                E: []
            });
        });

        it('should get an object containing the correct properties with a pluck regex', function () {
            var pluckLens = new PluckLens(/[a-z]/);

            expect(pluckLens.view(obj).get()).to.eql({
                d: 1,
                a: {
                    b: 0,
                    C: 2
                }
            });
        });

        it('should get an object containing the correct properties with a pluck function', function () {
            var pluckLens = new PluckLens(function (prop) {
                return prop.match(/[a-z]/);
            });

            expect(pluckLens.view(obj).get()).to.eql({
                d: 1,
                a: {
                    b: 0,
                    C: 2
                }
            });
        });

        it('should recursively prune the object if the recursive flag is set', function () {
            var pluckLens = new PluckLens.Recursive(/[a-z]/);

            expect(pluckLens.view(obj).get()).to.eql({
                a: { b: 0 },
                d: 1
            });
        });
    });

    describe('#map', function () {
        var obj = {
                _a : {
                    _b: {
                        c: 2
                    }
                },
                d: 3
            },
            double = function (elem) {
                return elem * 2;
            };

        it('should map the correct properties with a pluck array', function () {
            var pluckLens = new PluckLens(['d']);

            expect(pluckLens.view(obj).map(double)).to.eql({
                _a: {
                    _b: {
                        c: 2
                    }
                },
                d: 6
            });
        });

        it('should map the correct properties with a pluck regex', function () {
            var pluckLens = new PluckLens(/^[a-z]$/);

            expect(pluckLens.view(obj).map(double)).to.eql({
                _a: {
                    _b: {
                        c: 2
                    }
                },
                d: 6
            });
        });

        it('should map the correct properties with a pluck function', function () {
            var pluckLens = new PluckLens(function (prop) {
                return prop.match(/^[a-z]$/);
            });

            expect(pluckLens.view(obj).map(double)).to.eql({
                _a: {
                    _b: {
                        c: 2
                    }
                },
                d: 6
            });
        });

        it('should map recursively if the recursive flag is on', function () {
            var pluckLens = new PluckLens.Recursive(/^[a-z]$/);

            expect(pluckLens.view(obj).map(double)).to.eql({
                _a: {
                    _b: {
                        c: 4
                    }
                },
                d: 6
            });
        });
    });
});