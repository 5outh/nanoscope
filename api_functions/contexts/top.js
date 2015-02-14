var fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    getCode,
    contexts;

getCode = function (name) {
    return fs.readFileSync(path.resolve(__dirname + '/../code/' + name +'.js'), 'utf8');
};

contexts = [
    {
        name: 'filter',
        description: 'Focus on elements of an array filtered by a regular expression or function.',
        code: getCode('filter'),
        output_lines: [{ out: '[1, 100, 3]\n'}, { out: '[\'a\']'}]
    },
    {
        name: 'index',
        description: 'Focus on the element of an array at a given index. Returns undefined if the index is out of bounds.',
        code: getCode('index'),
        output_lines: [{ out: '[101, 2, 3]' }]
    },
    {
        name: 'unsafeIndex',
        description: 'Same as index, but throws errors if trying to access an element outside of array bounds. ' +
        'Allows setting the element directly after the end of an array (arr[arr.length]).',
        code: getCode('unsafeIndex'),
        output_lines: [{ out: '1\n'}, {out: 'Error: Attempt to access invalid index 0'}]
    },
    {
        name: 'slice',
        description: 'Focus on a slice of an array. A slice can be specified using either start and end bounds ' +
        '(negative bounds count from the end of an array) or by a string in python-style syntax (i.e \'1:10\').',
        code: getCode('slice'),
        output_lines: [{ out: '[2, 3]\n' }, { out: '[5, 4, 3]' }]
    },
    {
        name: 'path',
        description: 'Focus on the value located at some path in an object. Paths are given by .-separated strings. ' +
        'If the value at a path doesn\'t exist (i.e. accessing {}.a.b), get() will return undefined, even ' +
        'if it would otherwise throw an error. set() will set the value, adding properties as necessary. map() will ' +
        'do the same, but if its output returns undefined, the structure will be unmodified. Note that setting values' +
        ' that don\'t exist can overwrite parent objects (see the final example).',
        code: getCode('path'),
        output_lines: [{ out: '\'flintstones\'\n' }, { out: 'undefined\n' }, {out: '{ a: { b: { c: { d: \'vitamins\' } } } }'}]
    },
    {
        name: 'unsafePath',
        description: 'The same as path, but does not attempt to catch errors and will instead throw them.',
        code: getCode('unsafePath'),
        output_lines: [{ out: 'Error: Cannot read property \'b\' of undefined' }]
    },
    {
        name: 'pluck',
        description: 'Focus on a set of properties in an object matching one of:\n\n* an array of properties ' +
        '(e.g. [\'a\', \'b\']),\n* a regular expression (e.g /[a-b]/)\n* or a function (e.g function (prop) { return prop.match(/[a-b]/); }' +
        '\nNote that this does not recurse into subobjects, and only operates on the top-level properties.',
        code: getCode('pluck'),
        output_lines: [
            { out: '{ \'abc\': 1 }\n' },
            { out: '{ \'abc\': 1, \'def\': 2 }\n' },
            { out: '{ \'abc\': 1, \'def\': 2, \'WAT\': \'unknown\' }' }
        ]
    },
    {
        name: 'recursivePluck',
        description: 'The same as pluck, but recurses into subobjects.',
        code: getCode('recursivePluck'),
        output_lines: [{ out: '{ a: { b: 100 } }' }]
    },
    {
        name: 'each',
        description: 'Focus on every element of an array and further process it.',
        code: getCode('each'),
        output_lines: [{out: '[100, 10]'}]
    },
    {
        name: 'own',
        description: 'Focus on every value of an object and further process it.',
        code: getCode('own'),
        output_lines: [{ out: '[100, 10]' }]
    }
];

module.exports = contexts;