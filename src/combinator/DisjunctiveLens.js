var _ = require('lodash'),
    Lens = require('../base/Lens'),

    DisjunctiveLens,
    get,
    map;

/**
 * The get function for a DisjunctiveLens. Returns `lensA.get()` if it is non-null/undefined, and
 * `lensB.get()` otherwise.
 *
 * @param lensA
 * @param lensB
 * @returns {Function}
 */
get = function (lensA, lensB) {
    return function (obj) {
        var gotten;

        try {
            gotten = lensA.get(obj);

            if (_.isNull(gotten) || _.isUndefined(gotten)) {
                return lensB.get(obj) || null;
            }

            return gotten;
        } catch (e) {
            // Do nothing, just move on...
        }

        return lensB.get(obj) || null;
    };
};

/**
 * The map function for a DisjunctiveLens
 *
 * @param lensA
 * @param lensB
 * @returns {Function}
 */
map = function (lensA, lensB) {
    return function (obj, func) {
        var gotten;

        try {
            gotten = lensA.get(obj);

            if (_.isNull(gotten) || _.isUndefined(gotten)) {
                return lensB.map(obj, func);
            }

            return lensA.map(obj, func);
        } catch (e) {
            // Do nothing, just move on...
        }

        return lensB.map(obj, func);
    };
};

/**
 * A DisjunctiveLens is a lens that first tries to focus with its first argument if it exists,
 * and otherwise focuses with its second.
 *
 * @param lensA
 * @param lensB
 * @constructor
 * @param options
 */
DisjunctiveLens = function (lensA, lensB, options) {
    this.base = Lens;
    this.base(get(lensA, lensB), map(lensA, lensB), _.extend({ _lensA: lensA, _lensB: lensB, _disjunctive: true }, options));
};

DisjunctiveLens.prototype = new Lens;

module.exports = DisjunctiveLens;