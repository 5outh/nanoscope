nanoscope({
    x: [100],
    y: [200]
}).own(function (val) {
    return val.index(0);
}).get();