/**
 * A `Lens` is a construct that allows you to 'peer into' some structure and operate on sub-parts of it. A `Lens` supports
 * three basic operations:
 *
 * 1. `get`, which takes an object and gets a piece of it,
 * 2. `map`, which takes an object and maps a function over it, and
 * 3. `set`, which takes an object and sets it to some value.
 *
 * To construct a `Lens`, you must provide both a `get` function and an `map` function. `set` is a special case of `map`, so you
 * don't need to explicitly define it.
 *
 * As a simple example, the following constructs a `Lens` that focuses on the first element of an array:
 *
 * ```javascript
 * var headLens = new Lens (
 *     function (arr) { return arr[0]; },
 *     function (arr, func) {
 *         var newArr = _.deepClone(arr); // Lenses should operate on immutable data, don't modify original array
 *         newArr[0] = func(newArr[0]); // Apply a user-specified function to the head of the array and set the first element
 *         return newArr; // Return the modified array
 *     }
 * );
 * ```
 *
 * Any user-constructed lenses are expected to obey the Lens laws, as follows:
 *
 * 1. set-get (you get what you put in): `lens.get(a, lens.set(a, b)) = b`
 * 2. get-set (putting what is there doesn't change anything): `lens.set(a, lens.get(a)) = a`
 * 3. set-set (setting twice is the same as setting once): `lens.set(c, lens.set(b, a)) = lens.set(c, a)`
 *
 * These laws ensure that the getting and setting behavior make sense in the usual way.
 *
 * @param {function} get Get the value you want from the structure
 * @param {function} map Map a function map the value and return the modified structure
 * @param {object} flags Additional properties to add to `Lens` if specified
 * @returns {Lens}
 * @constructor
 */

import Compose from 'combinator/Compose';
import ConjunctiveLens from 'combinator/ConjunctiveLens';
import DisjunctiveLens from 'combinator/DisjunctiveLens';
import IndexedLens from 'array/IndexedLens';
import MultiLens from 'combinator/MultiLens';

import _ from 'lodash';

export default class Lens {
    constructor (get, map, flags) {
        this._flags = flags;
        this._get = get;
        this._map = map;

        this.then = this;
        
        if (this._flags._view) {
            this._view = _.clone(this._flags._view);
        }
    };

    /**
     * Get the value this `Lens` focuses on from an object
     */
    get = (obj) => this._get(obj) || this._view;

    /**
     * Run a function over the view of the `Lens` and return the modified structure
     */
    map = (obj, func) => {
        // If a view exists and a second argument isn't provided, use the view.
        if (this._view != null && !func) {
            return this._over(this._view, obj);
        }

        return this._over(obj, func);
    };

    /**
     * Map a function over the focus of this lens and return a new lens focusing
     * on the modified object.
     */
    mapping = (obj, func) => {
        this.view(this.map(obj, func))
        return this;
    };

    /**
     * Set the view of the `Lens` to something new and return the modified structure
     */
    set = (obj, val) => {
        // If a view exists, and a second argument isn't provided, set the view.
        if (this._view != null && _.isUndefined(val)) {
            return this.map(this._view, _.constant(obj));
        }

        return this.map(obj, _.constant(val));
    };
    
    /**
     * Set the value being focused on and return a new lens focusing on the modified object.
     */
    setting = (obj, val) => {
        this.view(this.set(obj, val));
        return this;
    };


    /**
     * Force the `Lens` to `view` a new object
     */
    view = (view) => {
        this._view = view;
        this._flags._view = view;
        return this;
    };

    /**
     * Alias for `view`
     */
    viewing = this.view;

    /**
     * Reset the view of this Lens
     */ 
    blur = () => this._view = null;

    /**
     * Get any flags for the lens
     */
    getFlags = () => this._flags;

    /**
     * Get a specific flag for the lens
     */
    getFlag = (flag) => this._flags[flag];

    /**
     * Add a flag to the lens
     */
    addFlag = (flag) => this._flags = _.extend(this._flags, flag);

    /**
     * Compose this lens with another lens
     */
    compose = (otherLens) => new Compose(this, otherLens, _.extend(this._flags || {}, otherLens.getFlags()))

    /**
     * Compose this lens with many other lenses in order
     */
    composeMany = (otherLenses) => {
        let lens = this;

        // Support variable length args
        if (arguments.length > 1) {
            otherLenses = arguments;
        }

        _.forEach(otherLenses, function (otherLens) {
            lens = lens.compose(otherLens);
        });

        return lens;
    };

    add = (otherLens) => new MultiLens([this, otherLens], _.extend(this._flags || {}, otherLens.getFlags()));

    addMany = (otherLenses) => {
        let lens = this;

        // Support variable length args
        if (arguments.length > 1) {
            otherLenses = arguments;
        }

        _.forEach(otherLenses, function (otherLens) {
            lens = lens.add(otherLens);
        });

        return lens;
    };

    /**
     * Focus on one location or another
     */
    or = (otherLens) => new DisjunctiveLens(
        this, 
        otherLens,
        _.extend(this.getFlags() || {}, otherLens.getFlags())
    );

    /**
     * Add a second lens focus
     */
    and = (otherLens) => new ConjunctiveLens(
        this, 
        otherLens,
        _.extend(this.getFlags() || {}, otherLens.getFlags())
    );

    /**
     * Focus on every element of an array at once
     */
    each = (eachFn) => {
        const arr = this.get();
        let lenses = [];

        if (_.isArray(arr)) {
            lenses = _.map(_.range(arr.length), function (idx) {
                return eachFn(new IndexedLens(idx));
            });
        }

        return this.compose(new MultiLens(lenses, this.getFlags()));
    };

    own = (ownFn) => {
        const obj = this.get();
        let lenses = [];

        if (_.isObject(obj)) {
            _.forEach(_.keys(obj), function (key) {
                lenses.push(ownFn(new PathLens(key).view(obj[key])));
            });
        }

        return this.compose(new MultiLens(lenses, this.getFlags()));
    };
};

