var _ = require('lodash'),
    fs = require('fs'),
    Handlebars = require('handlebars'),
    template = Handlebars.compile(fs.readFileSync('templates/api-functions.html', 'utf8')),
    final = require('./api_functions/contexts/final.js'),
    top = require('./api_functions/contexts/top.js'),
    other = require('./api_functions/contexts/other.js');

fs.writeFileSync('./_includes/final_functions.html', template({contexts: final}));
fs.writeFileSync('./_includes/top_functions.html', template({contexts: top}));
fs.writeFileSync('./_includes/other_functions.html', template({contexts: other}));
