var _ = require('lodash'),
    Lens = require('../src/Lens');

describe('Lens', function () {
    var testJS = {
        a: {
            b: 'c'
        }
    }, testLens = new Lens(
        function (obj) {
            return obj.a.b;
        },
        function (obj, func) {
            var newObj = _.cloneDeep(obj);
            newObj.a.b = func(newObj.a.b);
            return newObj;
        },
        { _extra: 'extra' }
    );

    describe('#get', function () {
        it('should return c', function () {
            testLens.get(testJS).should.equal('c');
        });
    });

    describe('#set', function () {
        it('should return a new object with modified obj.a.b', function () {
            testLens.set(testJS, 9).a.b.should.equal(9);
        });
    });

    describe('#over', function () {
        it('should turn testJS.a.b into cat', function () {
            testLens.over(testJS, function (attr) { return attr + 'at'; }).a.b.should.equal('cat');
        });
    });

    describe('#getOptions', function () {
        it('should return all custom options', function () {
            JSON.stringify(testLens.getOptions())
                .should.equal(JSON.stringify({ _extra: 'extra' }));
        });
    });
});