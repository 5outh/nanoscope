var lens = nanoscope({
    a: { b: 100, C: 99 }
});

lens.pluck(/[a-z]/).get();