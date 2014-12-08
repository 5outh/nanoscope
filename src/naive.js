
var _ = require('lodash'),
    NaiveLens;

NaiveLens = function (obj, get, set) {
    this._object = obj;
    this._get = get;
    this._set = set;
};

NaiveLens.prototype.get = function () {
    return this._get(this._object);
};

NaiveLens.prototype.set = function (val) {
    return this._set(this._object, val);
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
    function (obj, val) {
        var newObj = _.cloneDeep(obj);
        newObj.a.b = val;
        return newObj;
    });

console.log(
    testLens.get()
);

console.log(
    testLens.set(9)
);
