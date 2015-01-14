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
                    _pluck: ['a', 'b']
                }
            });
        });

        it('should set the recursive flag', function () {
            var pluckLens = new PluckLens.Recursive(/[a-z]/);

            pluckLens.should.have.properties({
                _flags: {
                    _recursive: true
                }
            });
        });

        it('should create a new pluck lens from a regular expression', function () {
            var regex = /[a-z]/,
                pluckLens = new PluckLens(regex);

            pluckLens.should.have.properties({
                _flags: {
                    _pluck: regex
                }
            });
        });

        it('should create a new pluck lens from a function', function () {
            var fn = _.identity,
                pluckLens = new PluckLens(fn);

            pluckLens.should.have.properties({
                _flags: {
                    _pluck: fn
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

            pluckLens.view(obj).get().should.have.properties({
                d: 1,
                E: []
            });
        });

        it('should get an object containing the correct properties with a pluck regex', function () {
            var pluckLens = new PluckLens(/[a-z]/);

            pluckLens.view(obj).get().should.have.properties({
                d: 1,
                a: {
                    b: 0,
                    C: 2
                }
            });
        });

        it('should get an object containing the correct properties with a pluck function', function () {
            var pluckLens = new PluckLens(function (prop) { return prop.match(/[a-z]/); });

            pluckLens.view(obj).get().should.have.properties({
                d: 1,
                a: {
                    b: 0,
                    C: 2
                }
            });
        });

        it('should recursively prune the object if the recursive flag is set', function () {
            var pluckLens = new PluckLens.Recursive(/[a-z]/);

            pluckLens.view(obj).get().should.have.properties({
                a: { b: 0 },
                d: 1
            });
        });
    });

    describe('#map', function () {
        // TODO
    });
});