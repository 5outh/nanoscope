var coordinate = { x: 2, y: 4 },
    square = function (val) { return val * val; };

coordinate.path('y').mapping(square).get();