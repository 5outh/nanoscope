var lens = nanoscope({
    'abc' : 1,
    'def' : 2,
    'WAT' : null
});

lens.pluck(['abc']).get();

lens.pluck(/[a-d]*/).get();

lens.pluck(function (prop, val) {
    return !val;
}).set('unknown');