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
        name: 'get',
        description: 'Get the value at the focus of the lens and return it.',
        code: getCode('get'),
        output_lines: [{ out: 3 }]
    },
    {
        name: 'set',
        description: 'Set the value at the focus of the lens and return a modified structure.',
        code: getCode('set'),
        output_lines: [{out: '[1, 2, 100]'}]
    },
    {
        name: 'map',
        description: 'Map the value at the focus of the lens to something else using a function and return a modified structure.',
        code: getCode('map'),
        output_lines: [{out: '[1, 2, 9]'}]
    }
];

module.exports = contexts;