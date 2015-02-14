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
        name: 'then',
        description: 'Alias for the current lens that (kind of) improves readability.',
        code: getCode('then'),
        output_lines: [{ out: 10 }]
    },
    {
        name: 'catch',
        description: 'Catch any exceptions thrown from an unsafe lens and handle them with an error handler',
        code: getCode('catch'),
        output_lines: [{ out: '[Error: Attempt to access invalid index 10000]' }]
    },
    {
        name: 'mixin',
        description: [
            'Add a function to `nanoscope`. The `this` context in the lens passed in will be replaced with the',
            'current nanoscope context when it is called. Any function like this should return a new Lens (i.e. use',
            'only the existing chainable nanoscope functions) or terminate with one of the final functions.'
        ].join('\n'),
        code: getCode('mixin'),
        output_lines: [{ out: '[2.5, 3.5]' }]
    },
    {
        name: 'setter',
        description: 'Disallow set and map in a Lens. Typically called at the end of Lens construction because ' +
        'internal functions rely on set and map occasionally.',
        code: getCode('setter'),
        output_lines: [{ out: '{ a: 30 }\n' }, { out: 'Error: get not permitted in a Setter' }]
    },
    {
        name: 'getter',
        description: 'Catch any exceptions thrown from an unsafe lens and handle them with an error handler',
        code: getCode('getter'),
        output_lines: [{ out: '1\n' }, { out: 'Error: map not permitted in a Getter' }]
    }
];

module.exports = contexts;