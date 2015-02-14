var lens = nanoscope.index([1, 2, 3]).index(2);

lens.map(function (num) {
    return (num * num);
});