nanoscope([1, 2, 3]).filter(function (elem) {
    return (elem % 2 === 0);
}).set(100);

nanoscope(['a', 'B', 'C']).filter(/[a-z]/).get();