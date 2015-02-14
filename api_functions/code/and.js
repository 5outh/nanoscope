var foobar = {foo: 1, bar: 2},
    lens = nanoscope(foobar),
    conjunctiveLens = lens.path('foo').and(lens.path('bar'));

conjunctiveLens.get();

conjunctiveLens = lens.path('foo').and(lens.path('baz'));

conjunctiveLens.get();