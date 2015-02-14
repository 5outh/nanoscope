var foobar = {foo: 1, bar: 2},
    lens = nanoscope(foobar),
    conjunctiveLens = lens.path('foo').or(lens.path('bar'));

conjunctiveLens.get();

conjunctiveLens = lens.path('baz').or(lens.path('bar'));

conjunctiveLens.get();