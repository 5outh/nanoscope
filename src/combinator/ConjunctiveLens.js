var _ = require('lodash'),
    Lens = require('../base/Lens'),
    MultiLens = require('./MultiLens'),

    ConjunctiveLens,
    isNullOrUndefined,
    get,
    map;

isNullOrUndefined = function (obj) {
    return _.isNull(obj) || _.isUndefined(obj);
};

/**
 * The get function for a DisjunctiveLens. Returns a MultiLens that focuses
 * on both lenses iff both lenses focus on an existing element
 *
 * @param lensA
 * @param lensB
 * @returns {Function}
 */
get = function (lensA, lensB) {
    return function (obj) {
        var gottenA, gottenB;

        try {
            gottenA = lensA.get(obj);
            gottenB = lensB.get(obj);

            if (isNullOrUndefined(gottenA) || isNullOrUndefined(gottenB)) {
                return null;
            }

            return lensA.add(lensB).get(obj);
        } catch (e) {
            // Do nothing, just move on...
        }

        return null;
    };
};

/**
 * The map function for a ConjunctiveLens
 *
 * @param lensA
 * @param lensB
 * @returns {Function}
 */
map = function (lensA, lensB) {
    return function (obj, func) {
        var gottenA, gottenB;

        try {
            gottenA = lensA.get(obj);
            gottenB = lensB.get(obj);

            if (isNullOrUndefined(gottenA) || isNullOrUndefined(gottenB)) {
                // Do nothing if the element doesn't exist
                return obj;
            }

            return lensA.add(lensB).map(obj, func);
        } catch (e) {
            // Do nothing, just move on...
        }

        return obj;
    };
};

/**
 * A ConjunctiveLens is a lens that first tries to focus with its first argument if it exists,
 * and otherwise focuses with its second.
 *
 * @param lensA
 * @param lensB
 * @constructor
 * @param options
 */
ConjunctiveLens = function (lensA, lensB, options) {
    this.base = Lens;
    this.base(
        get(lensA, lensB),
        map(lensA, lensB),
        _.extend({ _lensA: lensA, _lensB: lensB, _conjunctive: true }, options)
    );
};

ConjunctiveLens.prototype = new Lens;

module.exports = ConjunctiveLens;