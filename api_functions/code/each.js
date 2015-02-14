nanoscope({
    locations: [{x: 100, y: 200}, {x: 10, y: 0}]
}).path('locations')
  .each(function (loc) {
      return loc.path('x');
  }).get();