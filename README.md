<img src="NanoscopeLogo.png" width="400px"></img>

<img src="https://travis-ci.org/5outh/nanoscope.svg?branch=master"></img> [![Coverage Status](https://coveralls.io/repos/5outh/nanoscope/badge.svg?branch=pluck-extensions)](https://coveralls.io/r/5outh/nanoscope?branch=pluck-extensions)

## A Lens Library for Javascript

Installation is easy:

```
$ npm install nanoscope
```

## What is nanoscope?

`nanoscope` lets you wrangle your data like never before. It lets you pick and choose pieces of large
data structures to pull out, set, and/or modify. `nanoscope` comes equipped with a library of combinators to make even
complex transformations completely seamless.

## How about an example?

Alright, here you go:

```js
var lens = nanoscope({
        a: { b: [{b : 0, c: 0, B: 99}, 2, 3] }
    });

lens.path('a.b').index(0).pluck(/[a-z]*/).set(100);
// => a: { b: [{c : 100, d: 100, D: 99}, 2, 3] }
```

This traverses the object following the path `a.b`, looks at the first element, plucks out only the lowercase
properties from this element, sets each of them to 100 and returns a modified structure.

## What can I do with nanoscope?

TODO

## API

TODO

## Contributing

TODO

## License

TODO