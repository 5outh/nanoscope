var lens = nanoscope({ a: 100 }).path('a').setter();

lens.set(30);

lens.get();