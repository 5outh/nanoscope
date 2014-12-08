
var _ = require('lodash'),
    constant,
    NaiveLens;

/**
 * Discards the second argument and returns the first.
 *
 * @param a
 * @returns {Function}
 */
constant = _.curry(function(a, b) { return a; });

NaiveLens = function (obj, get, over) {
    this._object = obj;
    this._get = get;
    this._over = over;
};

NaiveLens.prototype.get = function () {
    return this._get(this._object);
};

NaiveLens.prototype.over = function (func) {
    return this._over(this._object, func);
};

NaiveLens.prototype.set = function (val) {
    return this._over(this._object, constant(val));
};

var testJS = {
    a: {
        b: 'c'
    }
};

var testLens = new NaiveLens(
    testJS,
    function (obj) {
        return obj.a.b;
    },
    function (obj, func) {
        var newObj = _.cloneDeep(obj);
        newObj.a.b = func(newObj.a.b);
        return newObj;
    });

console.log(
    testLens.get()
);

console.log(
    testLens.set(9)
);