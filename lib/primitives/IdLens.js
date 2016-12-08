import _ from 'lodash';
import Lens from 'base/Lens';

/**
 * The simplest possible `Lens`: operates on a single object; `get` returns the object and `map` applies a function to it
 * and returns the result.
 *
 * @type {Lens}
 */
export const IdLens = () => (new Lens(
        _.identity,
        (val, func) => func(_.cloneDeep(val))
    )
);
