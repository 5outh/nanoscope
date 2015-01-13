"use strict";

var _ = require('lodash'),
    PathLens = require('../../src/object/PathLens'),
    idLens = require('../primitives/idLens'),
    leavesLens;

leavesLens = function (obj) {
    var paths,
        pathLenses,
        maxLength = 0;

    paths = _(PathLens.deriveLenses(obj)).map(function (path) {
        var pathArr = path.split('.');

        // Set the max length
        if (pathArr.length > maxLength) {
            maxLength = pathArr.length;
        }

        return pathArr;
    });

    paths = _.filter(paths, function (path) {
        return path.length === maxLength;
    });

    pathLenses = _.map(paths, function (path) {
        return new PathLens(path);
    });

    if (_.isEmpty(pathLenses)) {
        return idLens;
    }

    // Add all path lenses
    return pathLenses[0].addMany(_.tail(pathLenses));
};

module.exports = leavesLens;