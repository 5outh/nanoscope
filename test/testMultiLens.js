"use strict";

var _ = require('lodash'),
    MultiLens = require('../src/MultiLens'),
    IndexedLens = require('../src/array/IndexedLens'),

    utils = require('./utils');

describe('MultiLens', function () {
    var testArr = [1, 2, 3, 4, 5],
        arrayLenses = [
            new IndexedLens(0),
            new IndexedLens(1)
        ],
        objectLenses = {
            head: new IndexedLens(0),
            last: new IndexedLens(-1)
        },
        arrayMultiLens = new MultiLens(arrayLenses),
        objectMultiLens = new MultiLens(objectLenses);

    describe('#MultiLens', function () {
        it('should have an array of lenses', function () {
            utils.testArrayEquals(arrayMultiLens._lenses, arrayLenses);
        });

        it('should have the right object of lenses', function () {
            JSON.stringify(objectMultiLens._lenses)
                .should.equal(JSON.stringify(objectLenses));
        });
    });
});