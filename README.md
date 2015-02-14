<a href="http://kovach.me/nanoscope/"><img src="NanoscopeLogo.png" width="400px"></img></a>

[![NPM](https://nodei.co/npm/nanoscope.png?compact=true)](https://nodei.co/npm/nanoscope/)

<img src="https://travis-ci.org/5outh/nanoscope.svg?branch=master"></img> [![Coverage Status](https://coveralls.io/repos/5outh/nanoscope/badge.svg?branch=master)](https://coveralls.io/r/5outh/nanoscope?branch=master)

## What is nanoscope?

`nanoscope` lets you wrangle your data like never before. It enables:

* Safe access of deeply-nested objects
* Complex modifications of arbitrary data structures
* Immutable data transformations
* and more!

## What can I do with nanoscope?

Using `nanoscope` typically looks like this:

1. Provide the structure you want to get pieces from and/or transform to `nanoscope`,
2. Add lens rules to the `nanoscope` instance, which specify the pieces you want to look at, and finally
3. call `get()`, `set()` or `map()` to perform some action on your data.

Let's look at an example:

```js
var nanoscope = require('nanoscope');

// A theoretical representation of a game
var game = {
    player: {
        name: 'Benjamin',
        coordinates: {
            x: 58,
            y: 99,
            z: 100
        }
    }
};

game = nanoscope(game)    // Focus on the game
    .path('player.name')  // Follow a path to player's name
    .set('5outh');        // Set the player's name to something new and return a new game

// Create a reusable lens constructor
var xyCoordinates = function (game) {
    return nanoscope(game)               // Focus on the game
        .following('player.coordinates') // 'following' is an alias for 'path'
        .plucking(['x', 'y']);           // Pluck the x and y coordinates from the focus
};

game = xyCoordinates(game)  // View the x and y coordinates of the game
    .map(function (val) {   // Add one to both coordinates and return a new
        return val + 1;     // game object.
    });

xyCoordinates(game).get(); // Returns { x: 59, y: 100 }
```

## What next?

View more examples and the API documentation at [the official nanoscope website](http://kovach.me/nanoscope/).

## Contributing

Feature requests, pull requests, code reviews, comments and concerns are more than welcome. If you have an issue with
nanoscope, please file it [on github](https://github.com/5outh/nanoscope/issues). When submitting pull requests, please create a feature branch and explain in detail what
you've changed and why.

Before adding features, please submit a feature request through [the issue tracker on github](https://github.com/5outh/nanoscope/issues). I will not add features to nanoscope blindly, but would love to hear
your ideas! Once a feature request is approved (I'll just comment saying it's cool), anyone can work on it and submit a pull request for review.

When submitting pull requests, please:

1. Make sure that tests are passing (run `npm test` with mocha installed globally (`npm install -g mocha`)), and
2. Add at least one test that tests the feature you are adding or fixing.

All pull requests will be run through Travis for automatic testing and Coveralls for code coverage information. If the code coverage percentage
has dropped, please explain why in your pull request.

Thanks your support of the project, and happy hacking!

## License

The MIT License (MIT)

Copyright (c) 2015 Benjamin Kovach

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
