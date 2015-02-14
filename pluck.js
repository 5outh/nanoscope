var lens = nanoscope({
    'abc' : 1,
    'def' : 2,
    'WAT' : null
});

lens.pluck(['abc']).get();
// #=> { 'abc': 1 }

lens.pluck(/[a-d]*/).get();
// #=> { 'abc': 1, 'def': 2 }

lens.pluck(function (prop) {
    return prop === 'WAT'
}).set('unknown');
// #=> { 'abc': 1, 'def': 2, 'WAT': 'unknown' }