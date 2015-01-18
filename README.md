<img src="NanoscopeLogo.png" width="400px"></img>

<img src="https://travis-ci.org/5outh/nanoscope.svg?branch=master"></img> [![Coverage Status](https://coveralls.io/repos/5outh/nanoscope/badge.svg?branch=pluck-extensions)](https://coveralls.io/r/5outh/nanoscope?branch=pluck-extensions)

## A Lens Library for Javascript

Installation is easy:

```
$ npm install nanoscope
```

## What is nanoscope?

`nanoscope` lets you wrangle your data like never before.
At a basic level, it allows:

* Safe access of deeply-nested objects,
* Complex transformation of arbitrary data structures
* Immutable transformations of data

## What can I do with nanoscope?

The general flow of using `nanoscope` goes like this:

1. Provide the structure you want to get pieces from and/or transform to `nanoscope`,
2. Add lens rules to the `nanoscope` instance, which specify the pieces you want to look at, and finally
3. call `get()`, `set()` or `map()` to perform some action on your data.

That's a little confusing. Let's look at an example:

```js
var nanoscope = require('nanoscope'),
    lens = nanoscope({
        a: {
            b: [{c : 0, d: 0, D: 99}, 2, 3]
        }
    });

lens.path('a.b')
    .index(0)
    .pluck(/[a-z]*/)
    .set(100);
// => {
//      a: {
//          b: [{c : 100, d: 100, D: 99}, 2, 3]
//       }
//    }
```

This traverses the object following the path `a.b`, looks at the first element, plucks out only the lowercase
properties from this element, sets each of them to 100 and returns a modified structure.

All the way up to the `.set()` call, you're constructing pure data. You don't actually call any functions on the
original object until `.set()` is called. This means that you can keep a reference to the lens in question like this instead:

```js
lens = lens.path('a.b').index(0).pluck(/[a-z]*/);
```

And call `get()`, `set()` and `map()` on that lens directly whenever necessary. You can even specify further lens rules
later on, like so:

```js
lens.pluck(['c']).get();
// => { c: 0 }
```

This allows for a lot of flexibility.

## API

TODO

## Contributing

TODO

## License

TODO