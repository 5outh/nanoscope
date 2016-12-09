import _ from 'lodash';
import Lens from 'base/Lens';

/**
 * Never allow `get` in a setter
 */
const get = function () {
    throw new Error('get not permitted in a Setter');
};

/**
 * A `Setter` is a `Lens` that only supports setting and mapping. A `Setter` is constructed with a single function (`map`).
 *
 * @param {function} map Function that maps over the view of the Lens and returns the result.
 * @param {object} options Additional flags to set in the Lens.
 * @returns {Lens}
 * @constructor
 */
export default class Setter extends Lens {
    constructor (map, options) {
        super(get, map, _.extend(opts, options, { _setter: true }));
        this.base = Lens;
    };

    fromLens  = (lens) => new Setter(lens._over, lens.getFlags());
}

Lens.prototype.setter = () => Setter.fromLens(this);
