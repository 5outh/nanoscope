nanoscope([1, 2, 3]).slice('1:').get();
// #=> [2, 3]

nanoscope([1, 2, 3]).slice(0, -1).set([5, 4]);
// #=> [5, 4, 3]